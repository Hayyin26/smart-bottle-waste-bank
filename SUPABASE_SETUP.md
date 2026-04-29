# Setup Database Supabase

## Langkah 1: Buat Tabel di Supabase

1. Buka dashboard Supabase Anda: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik menu **SQL Editor** di sidebar kiri
4. Klik **New Query**
5. Copy semua isi file `supabase-schema.sql` dan paste ke SQL Editor
6. Klik **Run** untuk menjalankan query

## Langkah 2: Verifikasi Tabel Sudah Dibuat

1. Klik menu **Table Editor** di sidebar
2. Pastikan tabel berikut sudah ada:
   - `nasabah`
   - `jenis_sampah`
   - `transaksi_sampah`

## Langkah 3: Insert Data Sample (Opsional)

Jika ingin mengisi data sample untuk testing, jalankan query berikut di SQL Editor:

```sql
-- Insert sample nasabah
INSERT INTO nasabah (nama, email, nomor_hp, alamat, kecamatan, saldo_point, total_transaksi, terdaftar, status) VALUES
  ('Budi Santoso', 'budi@email.com', '08123456789', 'Jl. Merdeka No. 45', 'Bandung Wetan', 12500, 24, '2024-01-15', 'aktif'),
  ('Siti Nurhaliza', 'siti@email.com', '08234567891', 'Jl. Gatot Subroto No. 78', 'Bandung Kulon', 8750, 15, '2024-02-20', 'aktif'),
  ('Ahmad Hidayat', 'ahmad@email.com', '08345678912', 'Jl. Pendidikan No. 12', 'Bandung Utara', 5200, 8, '2024-03-10', 'aktif');
```

## Langkah 4: Test Koneksi

1. Pastikan file `.env` sudah berisi:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. Restart development server:
   ```bash
   npm run dev
   ```

3. Buka aplikasi dan cek apakah data dari database sudah muncul

## Struktur Tabel

### Tabel: nasabah
- `id` (UUID, Primary Key)
- `nama` (VARCHAR)
- `email` (VARCHAR, Unique)
- `nomor_hp` (VARCHAR)
- `alamat` (TEXT)
- `kecamatan` (VARCHAR)
- `saldo_point` (INTEGER)
- `total_transaksi` (INTEGER)
- `terdaftar` (DATE)
- `status` (VARCHAR: 'aktif' | 'nonaktif')

### Tabel: jenis_sampah
- `id` (UUID, Primary Key)
- `nama` (VARCHAR)
- `harga_per_kg` (INTEGER)
- `icon` (VARCHAR)
- `warna` (VARCHAR)

### Tabel: transaksi_sampah
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key ke nasabah)
- `jenis_sampah` (VARCHAR)
- `berat` (DECIMAL)
- `satuan` (VARCHAR)
- `nilai_tukar` (INTEGER)
- `tanggal` (DATE)
- `waktu` (TIME)
- `status` (VARCHAR: 'selesai' | 'pending' | 'dibatalkan')

## API Services

Setelah database setup, Anda bisa menggunakan service functions yang sudah dibuat:

### Nasabah Service (`src/services/nasabah.service.ts`)
- `getNasabahList()` - Get semua nasabah
- `getNasabahById(id)` - Get nasabah by ID
- `createNasabah(data)` - Tambah nasabah baru
- `updateNasabah(id, data)` - Update nasabah
- `deleteNasabah(id)` - Hapus nasabah

### Transaksi Service (`src/services/transaksi.service.ts`)
- `getTransaksiList()` - Get semua transaksi
- `getTransaksiByUserId(userId)` - Get transaksi by user
- `createTransaksi(data)` - Tambah transaksi baru
- `updateTransaksi(id, data)` - Update transaksi
- `deleteTransaksi(id)` - Hapus transaksi

### Jenis Sampah Service (`src/services/jenis-sampah.service.ts`)
- `getJenisSampahList()` - Get semua jenis sampah
- `getJenisSampahById(id)` - Get jenis sampah by ID
- `createJenisSampah(data)` - Tambah jenis sampah baru
- `updateJenisSampah(id, data)` - Update jenis sampah
- `deleteJenisSampah(id)` - Hapus jenis sampah

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan file `.env` ada dan berisi variabel yang benar
- Restart development server

### Error: "relation does not exist"
- Pastikan sudah menjalankan `supabase-schema.sql` di SQL Editor
- Cek di Table Editor apakah tabel sudah dibuat

### Data tidak muncul
- Cek console browser untuk error messages
- Pastikan RLS policies sudah di-enable
- Cek apakah ada data di tabel (gunakan SQL Editor untuk query)
