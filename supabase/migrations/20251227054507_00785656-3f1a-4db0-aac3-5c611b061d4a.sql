-- Create storage bucket for member photos
INSERT INTO storage.buckets (id, name, public) VALUES ('members', 'members', true);

-- Create storage policy for member photos
CREATE POLICY "Anyone can view member photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'members');

CREATE POLICY "Admins can upload member photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'members' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update member photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'members' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete member photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'members' AND has_role(auth.uid(), 'admin'::app_role));

-- Create member_profiles table for About page members
CREATE TABLE public.member_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  category TEXT NOT NULL,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.member_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view published member profiles"
ON public.member_profiles
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage member profiles"
ON public.member_profiles
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at
CREATE TRIGGER update_member_profiles_updated_at
BEFORE UPDATE ON public.member_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial member data from the About page
INSERT INTO public.member_profiles (name, role, category, display_order) VALUES
-- Founding Members
('Shri. Girish Rao', NULL, 'founding_members', 1),
('Shri. Ramprasad K', NULL, 'founding_members', 2),
('Shri. A M Shankar', NULL, 'founding_members', 3),
('Shri. Subramanya', NULL, 'founding_members', 4),
('Shri Udaykuamr', NULL, 'founding_members', 5),
('Shri. Rangaswamy', NULL, 'founding_members', 6),
('Shri. Girish Kumar', NULL, 'founding_members', 7),
('Shri. Shyam Sudar Kustagi', NULL, 'founding_members', 8),
('Smt. Sharadaraju', NULL, 'founding_members', 9),
('Smt. Roopashree', NULL, 'founding_members', 10),
-- Stalwarts
('Girish Rao', NULL, 'stalwarts', 1),
('Ramprasad K', NULL, 'stalwarts', 2),
('R P Chandru', NULL, 'stalwarts', 3),
-- Contributors
('A M Shankar', 'Leader Trainer (R)', 'contributors', 1),
('H G Lakshmi Narayan Rao', 'ALT (C)', 'contributors', 2),
('N Ashok Kumar', 'ALT (R)', 'contributors', 3),
('Divakar', NULL, 'contributors', 4),
-- Group Leaders
('Girish Rao', 'Group Leader', 'group_leaders', 1),
('R P Chandru', 'Group Leader', 'group_leaders', 2),
-- Cubs
('Naveen Kumar', 'HWB (C)', 'cubs', 1),
('Manu', 'ADV(C)', 'cubs', 2),
('Yashas', 'BASIC (C)', 'cubs', 3),
-- Bulbuls
('Bhavyashree R', 'ADV(FL)', 'bulbuls', 1),
('Shashikala', 'PRE-ALT (FL)', 'bulbuls', 2),
-- Scouts
('R P Chandru', 'HWB (S)', 'scouts', 1),
('Emmanuel Samson A', 'HWB (S)', 'scouts', 2),
('Ajay S', 'BASIC (S)', 'scouts', 3),
-- Guides
('Maria Leena', 'ADV (GC)', 'guides', 1),
('Anne L', 'BASIC (RL)', 'guides', 2),
-- Rovers
('Chandru P', 'HWB (R)', 'rovers', 1),
('Vishnu Prasad', 'HWB (R)', 'rovers', 2),
-- Rangers
('Tejaswini S', 'BASIC (RL)', 'rangers', 1),
-- Leadership Achievements
('R P Chandru', 'District Organizer', 'leadership', 1),
('Suprith', 'SW RLY', 'leadership', 2),
('Chandru P', 'ASOC', 'leadership', 3),
('Sukesh', 'SW RLY', 'leadership', 4),
('Manu', 'SGV', 'leadership', 5),
('Vishnuprasad B G', 'SW RLY', 'leadership', 6);