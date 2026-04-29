# Migration Guide: Dari Data Dummy ke Supabase

## Perubahan yang Dilakukan

### 1. File Baru yang Dibuat

#### Konfigurasi & Setup
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/database.types.ts` - TypeScript types untuk database schema
- `supabase-schema.sql` - SQL script untuk membuat tabel di Supabase
- `SUPABASE_SETUP.md` - Panduan lengkap setup database

#### Service Layer (API Functions)
- `src/services/nasabah.service.ts` - CRUD operations untuk nasabah
- `src/services/transaksi.service.ts` - CRUD operations untuk transaksi
- `src/services/jenis-sampah.service.ts` - CRUD operations untuk jenis sampah

### 2. File yang Diupdate

#### Data Files (Deprecated)
- `src/data/nasabah.ts` - Data dummy dihapus, sekarang kosong
- `src/data/waste-transactions.ts` - Data dummy dihapus, sekarang kosong

#### Pages (Menggunakan Supabase)
- `src/app/dashboard/page.tsx` - Fetch data dari Supabase
- `src/app/nasabah/page.tsx` - Fetch data dari Supabase
- `src/app/transaksi/page.tsx` - Fetch data dari Supabase

#### Components (Menggunakan Supabase)
- `src/components/waste-bank/waste-types-list.tsx` - Fetch data dari Supabase
- `src/components/waste-bank/waste-bank-summary.tsx` - Fetch data dari Supabase

### 3. Environment Variables
File `.env` sudah dikonfigurasi dengan:
```
NEXT_PUBLIC_SUPABASE_URL=https://dsdtxqpzofrvzxpyktoo.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

File `.gitignore` sudah diupdate untuk mengabaikan `.env`

## Cara Setup Database

### Langkah 1: Jalankan SQL Script
1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar
4. Copy isi file `supabase-schema.sql`
5. Paste dan klik **Run**

### Langkah 2: Verifikasi Tabel
Cek di **Table Editor** bahwa tabel berikut sudah dibuat:
- `nasabah`
- `jenis_sampah`
- `transaksi_sampah`

### Langkah 3: Insert Data Sample (Opsional)
Untuk testing, jalankan query ini di SQL Editor:

```sql
-- Insert sample nasabah
INSERT INTO nasabah (nama, email, nomor_hp, alamat, kecamatan, saldo_point, total_transaksi, terdaftar, status) VALUES
  ('Budi Santoso', 'budi@email.com', '08123456789', 'Jl. Merdeka No. 45', 'Bandung Wetan', 12500, 24, '2024-01-15', 'aktif'),
  ('Siti Nurhaliza', 'siti@email.com', '08234567891', 'Jl. Gatot Subroto No. 78', 'Bandung Kulon', 8750, 15, '2024-02-20', 'aktif'),
  ('Ahmad Hidayat', 'ahmad@email.com', '08345678912', 'Jl. Pendidikan No. 12', 'Bandung Utara', 5200, 8, '2024-03-10', 'aktif');

-- Insert sample transaksi (ganti USER_ID dengan ID dari nasabah yang sudah dibuat)
INSERT INTO transaksi_sampah (user_id, jenis_sampah, berat, satuan, nilai_tukar, tanggal, waktu, status)
SELECT 
  id,
  'Botol Plastik Kecil',
  2.5,
  'kg',
  500,
  CURRENT_DATE,
  CURRENT_TIME,
  'selesai'
FROM nasabah
WHERE email = 'budi@email.com'
LIMIT 1;
```

### Langkah 4: Restart Development Server
```bash
npm run dev
```

## Struktur Database

### Tabel: nasabah
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| nama | VARCHAR | Nama lengkap |
| email | VARCHAR | Email (unique) |
| nomor_hp | VARCHAR | Nomor HP |
| alamat | TEXT | Alamat lengkap |
| kecamatan | VARCHAR | Kecamatan |
| saldo_point | INTEGER | Saldo point saat ini |
| total_transaksi | INTEGER | Jumlah transaksi |
| terdaftar | DATE | Tanggal registrasi |
| status | VARCHAR | 'aktif' atau 'nonaktif' |

### Tabel: jenis_sampah
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| nama | VARCHAR | Nama jenis sampah |
| harga_per_kg | INTEGER | Harga per kg dalam point |
| icon | VARCHAR | Icon emoji |
| warna | VARCHAR | Tailwind color class |

### Tabel: transaksi_sampah
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| user_id | UUID | Foreign key ke nasabah |
| jenis_sampah | VARCHAR | Nama jenis sampah |
| berat | DECIMAL | Berat dalam kg |
| satuan | VARCHAR | Satuan (default: 'kg') |
| nilai_tukar | INTEGER | Nilai dalam point |
| tanggal | DATE | Tanggal transaksi |
| waktu | TIME | Waktu transaksi |
| status | VARCHAR | 'selesai', 'pending', atau 'dibatalkan' |

## API Service Functions

### Nasabah Service
```typescript
import { getNasabahList, getNasabahById, createNasabah, updateNasabah, deleteNasabah } from '@/services/nasabah.service';

// Get all nasabah
const nasabahList = await getNasabahList();

// Get by ID
const nasabah = await getNasabahById('uuid-here');

// Create new
const newNasabah = await createNasabah({
  nama: 'John Doe',
  email: 'john@email.com',
  // ... other fields
});

// Update
const updated = await updateNasabah('uuid-here', { saldoPoint: 5000 });

// Delete
const success = await deleteNasabah('uuid-here');
```

### Transaksi Service
```typescript
import { getTransaksiList, getTransaksiByUserId, createTransaksi, updateTransaksi, deleteTransaksi } from '@/services/transaksi.service';

// Get all transaksi
const transaksiList = await getTransaksiList();

// Get by user ID
const userTransaksi = await getTransaksiByUserId('user-uuid');

// Create new
const newTransaksi = await createTransaksi({
  userId: 'user-uuid',
  jenisAmpah: 'Botol Plastik',
  berat: 2.5,
  // ... other fields
});
```

### Jenis Sampah Service
```typescript
import { getJenisSampahList, getJenisSampahById, createJenisSampah, updateJenisSampah, deleteJenisSampah } from '@/services/jenis-sampah.service';

// Get all jenis sampah
const jenisSampahList = await getJenisSampahList();
```

## Fitur yang Ditambahkan

### Loading States
Semua halaman sekarang menampilkan loading spinner saat fetch data:
```tsx
if (loading) {
  return <LoadingSpinner />;
}
```

### Error Handling
Service functions menangani error dan log ke console:
```typescript
if (error) {
  console.error('Error fetching data:', error);
  return [];
}
```

### Real-time Updates
Untuk menambahkan real-time updates, Anda bisa menggunakan Supabase Realtime:
```typescript
useEffect(() => {
  const subscription = supabase
    .channel('nasabah-changes')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'nasabah' },
      (payload) => {
        // Refresh data
        fetchData();
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, []);
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Pastikan file `.env` ada di root project
- Restart development server

### Data tidak muncul
- Cek console browser untuk error
- Pastikan tabel sudah dibuat di Supabase
- Cek RLS policies di Supabase (sudah di-enable untuk public access)

### Error: "relation does not exist"
- Jalankan `supabase-schema.sql` di SQL Editor
- Verifikasi tabel ada di Table Editor

## Next Steps

1. ✅ Setup database di Supabase
2. ✅ Migrate dari data dummy ke Supabase
3. 🔄 Test semua fitur
4. 📝 Tambahkan form untuk CRUD operations
5. 🔐 Implement authentication (jika diperlukan)
6. 🚀 Deploy ke production
