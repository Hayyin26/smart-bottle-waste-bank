-- ============================================================================
-- Migration: Add Bottle Classification to Transactions
-- ============================================================================
-- Revisi Sistem Klasifikasi Botol dari 1 kategori (Sampah Umum) 
-- menjadi 3 kategori berdasarkan berat

-- Step 1: Add new columns to transactions table
-- NOTE: use PostgreSQL-compatible syntax (Supabase uses Postgres)
ALTER TABLE transactions
  ADD COLUMN IF NOT EXISTS bottle_weight numeric(5,1),
  ADD COLUMN IF NOT EXISTS bottle_type varchar(20),
  ADD COLUMN IF NOT EXISTS bottle_category_id integer;

-- Step 2: Create bottle_categories reference table
CREATE TABLE IF NOT EXISTS bottle_categories (
  id serial PRIMARY KEY,
  category_key varchar(20) NOT NULL UNIQUE,
  category_name varchar(50) NOT NULL,
  min_weight numeric(5,1) NOT NULL,
  max_weight numeric(5,1) NOT NULL,
  points_earned integer NOT NULL,
  color_hex varchar(7),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Step 3: Insert bottle categories
INSERT INTO bottle_categories (category_key, category_name, min_weight, max_weight, points_earned, color_hex, is_active) VALUES
('KECIL', 'BOTOL KECIL', 12.5, 18, 5, '#3B82F6', true),
('SEDANG', 'BOTOL SEDANG', 20, 23, 10, '#10B981', true),
('BESAR', 'BOTOL BESAR', 25, 28, 15, '#F59E0B', true)
ON CONFLICT (category_key) DO NOTHING;

-- Step 4: Add foreign key constraint (optional, tapi recommended)
-- Add foreign key constraint safely (Postgres doesn't support ADD CONSTRAINT IF NOT EXISTS)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_bottle_category'
      AND table_name = 'transactions'
  ) THEN
    ALTER TABLE transactions
      ADD CONSTRAINT fk_bottle_category
      FOREIGN KEY (bottle_category_id) REFERENCES bottle_categories(id);
  END IF;
END
$$;

-- Step 5: Create index untuk queries yang lebih cepat
CREATE INDEX IF NOT EXISTS idx_transactions_bottle_type ON transactions(bottle_type);
CREATE INDEX IF NOT EXISTS idx_transactions_bottle_weight ON transactions(bottle_weight);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);

-- Step 6: (OPTIONAL) Update existing transactions dengan default values
-- Uncomment jika ada data lama yang perlu di-update
-- UPDATE transactions 
-- SET bottle_weight = 1, bottle_type = 'KECIL' 
-- WHERE bottle_weight IS NULL;
-- NOTE: If you need column comments in Postgres, use COMMENT ON:
-- COMMENT ON COLUMN transactions.bottle_weight IS 'Berat botol dalam gram';
-- COMMENT ON COLUMN transactions.bottle_type IS 'Kategori botol: KECIL, SEDANG, BESAR';
-- COMMENT ON COLUMN transactions.bottle_category_id IS 'Foreign key ke bottle_categories table';

-- ============================================================================
-- Rollback (jika diperlukan):
-- ============================================================================
-- DROP TABLE IF EXISTS bottle_categories;
-- ALTER TABLE transactions DROP COLUMN bottle_weight;
-- ALTER TABLE transactions DROP COLUMN bottle_type;
-- ALTER TABLE transactions DROP COLUMN bottle_category_id;
-- Rollback example (Postgres):
-- ALTER TABLE transactions DROP CONSTRAINT IF EXISTS fk_bottle_category;
-- ALTER TABLE transactions DROP COLUMN IF EXISTS bottle_category_id;
-- ALTER TABLE transactions DROP COLUMN IF EXISTS bottle_type;
-- ALTER TABLE transactions DROP COLUMN IF EXISTS bottle_weight;
-- DROP TABLE IF EXISTS bottle_categories;
