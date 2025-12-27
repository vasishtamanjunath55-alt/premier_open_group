
-- Create storage buckets for different content types
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('posts', 'posts', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('programs', 'programs', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('awards', 'awards', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('shop', 'shop', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for gallery bucket
CREATE POLICY "Anyone can view gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'gallery' 
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'gallery'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'gallery'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for posts bucket
CREATE POLICY "Anyone can view post images"
ON storage.objects FOR SELECT
USING (bucket_id = 'posts');

CREATE POLICY "Admins can upload post images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update post images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'posts'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete post images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'posts'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for programs bucket
CREATE POLICY "Anyone can view program images"
ON storage.objects FOR SELECT
USING (bucket_id = 'programs');

CREATE POLICY "Admins can upload program images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'programs'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update program images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'programs'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete program images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'programs'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for awards bucket
CREATE POLICY "Anyone can view award images"
ON storage.objects FOR SELECT
USING (bucket_id = 'awards');

CREATE POLICY "Admins can upload award images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'awards'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update award images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'awards'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete award images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'awards'
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- RLS Policies for shop bucket
CREATE POLICY "Anyone can view shop images"
ON storage.objects FOR SELECT
USING (bucket_id = 'shop');

CREATE POLICY "Admins can upload shop images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'shop'
  AND (storage.foldername(name))[1] = auth.uid()::text
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can update shop images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'shop'
  AND has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete shop images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'shop'
  AND has_role(auth.uid(), 'admin'::app_role)
);
