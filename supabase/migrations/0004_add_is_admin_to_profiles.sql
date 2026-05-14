-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Allow admins to bypass some RLS or have special access
-- (No specific RLS changes needed yet, but good to have the column)
