-- Run this in your Supabase SQL Editor to fix room deletion

-- 1. Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() ->> 'email') IN (
    'pateldev2317@gmail.com',
    'girishguptaaditya@gmail.com',
    'pateldhairya64@gmail.com',
    'vaka2182003@gmail.com'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add the delete policy for private rooms
-- Delete allowed if user is admin OR if the profiles table username matches created_by
DROP POLICY IF EXISTS "Users can delete rooms they created or admins" ON private_rooms;
CREATE POLICY "Users can delete rooms they created or admins" ON private_rooms
  FOR DELETE
  USING (
    is_admin() OR 
    (auth.uid() IN (SELECT id FROM profiles WHERE username = private_rooms.created_by))
  );

-- 3. Fix the foreign key constraint so deleting a room deletes its messages
-- (Otherwise deleting a room with messages fails due to foreign key constraint)
ALTER TABLE messages
  DROP CONSTRAINT IF EXISTS messages_room_id_fkey;

ALTER TABLE messages
  ADD CONSTRAINT messages_room_id_fkey
  FOREIGN KEY (room_id)
  REFERENCES private_rooms(id)
  ON DELETE CASCADE;
