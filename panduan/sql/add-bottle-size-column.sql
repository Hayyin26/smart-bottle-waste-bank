-- Tambahkan kolom bottle_size ke tabel transactions
-- Run this in Supabase SQL Editor

ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS bottle_size TEXT;

-- Tambahkan comment untuk dokumentasi
COMMENT ON COLUMN public.transactions.bottle_size IS 'Ukuran botol: KECIL, SEDANG, atau BESAR';

-- Update existing records (optional - set default untuk data lama)
UPDATE public.transactions 
SET bottle_size = 'SEDANG' 
WHERE bottle_size IS NULL;

-- Verifikasi perubahan
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'transactions' 
AND column_name = 'bottle_size';
