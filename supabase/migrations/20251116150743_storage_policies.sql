-- Storage Policies for profile_photo bucket 
-- This migration adds RLS policies to allow public access to the profile_photo storage bucket 
 
-- Allow anyone to upload to the profile_photo bucket 
CREATE POLICY "Allow public uploads to profile_photo" 
ON storage.objects 
FOR INSERT 
TO public 
WITH CHECK ( 
  bucket_id = 'profile_photo' 
); 
 
-- Allow anyone to update files in the profile_photo bucket 
CREATE POLICY "Allow public updates to profile_photo" 
ON storage.objects 
FOR UPDATE 
TO public 
USING (bucket_id = 'profile_photo') 
WITH CHECK (bucket_id = 'profile_photo'); 
 
-- Allow anyone to delete files in the profile_photo bucket 
CREATE POLICY "Allow public deletes in profile_photo" 
ON storage.objects 
FOR DELETE 
TO public 
USING (bucket_id = 'profile_photo'); 
 
-- Allow anyone to read/view all files in the profile_photo bucket 
CREATE POLICY "Allow public reads from profile_photo" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'profile_photo');
