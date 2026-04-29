-- Script untuk membuat test user
-- Jalankan di Supabase SQL Editor

-- CARA 1: Buat user dengan UUID spesifik (harus unique)
-- Ganti email dan password sesuai kebutuhan
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111', -- User ID yang akan digunakan
  'authenticated',
  'authenticated',
  'testuser@example.com',
  crypt('password123', gen_salt('bf')), -- Password: password123
  NOW(),
  NOW(),
  NOW(),
  '',
  ''
);

-- Profile akan otomatis dibuat oleh trigger
-- Cek apakah profile sudah ada:
SELECT * FROM profiles WHERE id = '11111111-1111-1111-1111-111111111111';

-- Jika profile belum ada, buat manual:
INSERT INTO profiles (id, full_name, role, total_points)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Test User',
  'user',
  0
)
ON CONFLICT (id) DO NOTHING;
