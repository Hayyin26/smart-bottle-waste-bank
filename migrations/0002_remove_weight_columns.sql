-- Migration: remove weight-related columns
-- Safe to run even if some columns already do not exist.

ALTER TABLE bottle_categories
  DROP COLUMN IF EXISTS min_weight,
  DROP COLUMN IF EXISTS max_weight;

ALTER TABLE transactions
  DROP COLUMN IF EXISTS bottle_weight;
