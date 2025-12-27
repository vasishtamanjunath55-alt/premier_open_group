-- Add status column to profiles for approval workflow
ALTER TABLE public.profiles 
ADD COLUMN status text NOT NULL DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update existing profiles to be approved (so current admins don't get locked out)
UPDATE public.profiles SET status = 'approved';

-- Create policy for admins to delete profiles
CREATE POLICY "Admins can delete profiles" 
ON public.profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create policy for admins to insert profiles (for creating users)
CREATE POLICY "Admins can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR auth.uid() = id);

-- Update policy for admins to update any profile (for approve/reject)
CREATE POLICY "Admins can update all profiles" 
ON public.profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));