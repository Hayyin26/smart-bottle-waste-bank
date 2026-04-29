// This file is deprecated. Use src/services/transaksi.service.ts instead
// Data is now fetched from Supabase database

export type WasteTransaction = {
  id: string;
  userId: string;
  userName: string;
  jenisAmpah: string;
  berat: number; // dalam kg
  satuan: string;
  nilaiTukar: number; // dalam point
  tanggal: string;
  waktu: string;
  status: "selesai" | "pending" | "dibatalkan";
};

// Empty array - data should be fetched from Supabase
export const wasteTransactions: WasteTransaction[] = [];

export type WasteType = {
  id: string;
  nama: string;
  hargaPerKg: number; // dalam point
  icon: string;
  warna: string;
};

// Empty array - data should be fetched from Supabase using src/services/jenis-sampah.service.ts
export const wasteTypes: WasteType[] = [];
