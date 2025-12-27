-- Create contact_inquiries table
CREATE TABLE public.contact_inquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create member_registrations table
CREATE TABLE public.member_registrations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    registration_number TEXT,
    section TEXT NOT NULL,
    name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mother_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_group TEXT NOT NULL,
    mobile_no TEXT NOT NULL,
    email TEXT NOT NULL,
    communication_address TEXT NOT NULL,
    permanent_address TEXT NOT NULL,
    alternate_contact TEXT,
    school_college TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_registrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for contact_inquiries
CREATE POLICY "Anyone can submit contact inquiries"
ON public.contact_inquiries
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all contact inquiries"
ON public.contact_inquiries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact inquiries"
ON public.contact_inquiries
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete contact inquiries"
ON public.contact_inquiries
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for member_registrations
CREATE POLICY "Anyone can submit member registrations"
ON public.member_registrations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all registrations"
ON public.member_registrations
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update registrations"
ON public.member_registrations
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete registrations"
ON public.member_registrations
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Triggers for updated_at
CREATE TRIGGER update_contact_inquiries_updated_at
BEFORE UPDATE ON public.contact_inquiries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_member_registrations_updated_at
BEFORE UPDATE ON public.member_registrations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();