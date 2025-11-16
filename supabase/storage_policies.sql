-- Storage Policies for profile_photo bucket
-- Run this SQL in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Allow anyone to upload to their own folder (authenticated or not)
CREATE POLICY "Allow public uploads to own folder"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'profile_photo'
);

-- Allow anyone to update their own files
CREATE POLICY "Allow public updates to own files"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'profile_photo')
WITH CHECK (bucket_id = 'profile_photo');

-- Allow anyone to delete their own files
CREATE POLICY "Allow public deletes of own files"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'profile_photo');

-- Allow anyone to read/view all files (public bucket)
CREATE POLICY "Allow public reads"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile_photo');
