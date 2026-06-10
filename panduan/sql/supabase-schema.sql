-- Tabel Nasabah (Pengguna Bank Sampah)
CREATE TABLE IF NOT EXISTS nasabah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  nomor_hp VARCHAR(20) NOT NULL,
  alamat TEXT NOT NULL,
  kecamatan VARCHAR(100) NOT NULL,
  saldo_point INTEGER DEFAULT 0,
  total_transaksi INTEGER DEFAULT 0,
  terdaftar DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Jenis Sampah
CREATE TABLE IF NOT EXISTS jenis_sampah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama VARCHAR(255) NOT NULL,
  harga_per_kg INTEGER NOT NULL,
  icon VARCHAR(10) DEFAULT '♻️',
  warna VARCHAR(50) DEFAULT 'bg-gray-100',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Transaksi Sampah
CREATE TABLE IF NOT EXISTS transaksi_sampah (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES nasabah(id) ON DELETE CASCADE,
  jenis_sampah VARCHAR(255) NOT NULL,
  berat DECIMAL(10, 2) NOT NULL,
  satuan VARCHAR(10) DEFAULT 'kg',
  nilai_tukar INTEGER NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  waktu TIME NOT NULL DEFAULT CURRENT_TIME,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('selesai', 'pending', 'dibatalkan')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_nasabah_email ON nasabah(email);
CREATE INDEX IF NOT EXISTS idx_nasabah_status ON nasabah(status);
CREATE INDEX IF NOT EXISTS idx_transaksi_user_id ON transaksi_sampah(user_id);
CREATE INDEX IF NOT EXISTS idx_transaksi_tanggal ON transaksi_sampah(tanggal);
CREATE INDEX IF NOT EXISTS idx_transaksi_status ON transaksi_sampah(status);

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-update updated_at
CREATE TRIGGER update_nasabah_updated_at
  BEFORE UPDATE ON nasabah
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jenis_sampah_updated_at
  BEFORE UPDATE ON jenis_sampah
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaksi_sampah_updated_at
  BEFORE UPDATE ON transaksi_sampah
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert data jenis sampah default
INSERT INTO jenis_sampah (nama, harga_per_kg, icon, warna) VALUES
  ('Botol Plastik Kecil', 200, '🔵', 'bg-blue-100'),
  ('Botol Plastik Sedang', 200, '🟦', 'bg-blue-200'),
  ('Botol Plastik Besar', 1600, '🟦', 'bg-blue-300')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE nasabah ENABLE ROW LEVEL SECURITY;
ALTER TABLE jenis_sampah ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi_sampah ENABLE ROW LEVEL SECURITY;

-- Policy untuk public access (sesuaikan dengan kebutuhan keamanan Anda)
CREATE POLICY "Enable read access for all users" ON nasabah FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON nasabah FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON nasabah FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON nasabah FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON jenis_sampah FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON jenis_sampah FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON jenis_sampah FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON jenis_sampah FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON transaksi_sampah FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON transaksi_sampah FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON transaksi_sampah FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON transaksi_sampah FOR DELETE USING (true);
