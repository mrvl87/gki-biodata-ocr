-- Add Church ID column
ALTER TABLE ocr_anggota_keluarga ADD COLUMN IF NOT EXISTS id_gereja TEXT UNIQUE;
