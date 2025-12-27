
-- Create member_progress table to track each member's stats
CREATE TABLE public.member_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  badges_earned INTEGER NOT NULL DEFAULT 0,
  events_attended INTEGER NOT NULL DEFAULT 0,
  service_hours INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member_notifications table for individual notifications
CREATE TABLE public.member_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.member_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for member_progress
-- Members can view their own progress
CREATE POLICY "Members can view own progress" 
ON public.member_progress FOR SELECT 
USING (auth.uid() = user_id);

-- Admins can view all progress
CREATE POLICY "Admins can view all progress" 
ON public.member_progress FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert progress
CREATE POLICY "Admins can insert progress" 
ON public.member_progress FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update progress
CREATE POLICY "Admins can update progress" 
ON public.member_progress FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for member_notifications
-- Members can view their own notifications
CREATE POLICY "Members can view own notifications" 
ON public.member_notifications FOR SELECT 
USING (auth.uid() = user_id);

-- Members can update their own notifications (mark as read)
CREATE POLICY "Members can update own notifications" 
ON public.member_notifications FOR UPDATE 
USING (auth.uid() = user_id);

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications" 
ON public.member_notifications FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert notifications
CREATE POLICY "Admins can insert notifications" 
ON public.member_notifications FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete notifications
CREATE POLICY "Admins can delete notifications" 
ON public.member_notifications FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at on member_progress
CREATE TRIGGER update_member_progress_updated_at
BEFORE UPDATE ON public.member_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create progress record for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_progress()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.member_progress (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create progress for new users
CREATE TRIGGER on_auth_user_created_progress
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user_progress();
