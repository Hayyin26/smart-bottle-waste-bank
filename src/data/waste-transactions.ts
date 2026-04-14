export type WasteTransaction = {
  id: string;
  nasabahId: string;
  nasabahNama: string;
  jenisAmpah: string;
  berat: number; // dalam kg
  satuan: string;
  nilaiTukar: number; // dalam point
  tanggal: string;
  waktu: string;
  status: "selesai" | "pending" | "dibatalkan";
};

export const wasteTransactions: WasteTransaction[] = [
  {
    id: "T001",
    nasabahId: "N001",
    nasabahNama: "Budi Santoso",
    jenisAmpah: "Plastik PET",
    berat: 2.5,
    satuan: "kg",
    nilaiTukar: 500,
    tanggal: "2024-04-10",
    waktu: "10:30",
    status: "selesai",
  },
  {
    id: "T002",
    nasabahId: "N002",
    nasabahNama: "Siti Nurhaliza",
    jenisAmpah: "Kertas",
    berat: 1.8,
    satuan: "kg",
    nilaiTukar: 360,
    tanggal: "2024-04-10",
    waktu: "11:15",
    status: "selesai",
  },
  {
    id: "T003",
    nasabahId: "N003",
    nasabahNama: "Ahmad Hidayat",
    jenisAmpah: "Aluminium",
    berat: 0.5,
    satuan: "kg",
    nilaiTukar: 800,
    tanggal: "2024-04-10",
    waktu: "13:45",
    status: "selesai",
  },
  {
    id: "T004",
    nasabahId: "N004",
    nasabahNama: "Eka Putri",
    jenisAmpah: "Logam Besi",
    berat: 3.2,
    satuan: "kg",
    nilaiTukar: 640,
    tanggal: "2024-04-09",
    waktu: "09:20",
    status: "selesai",
  },
  {
    id: "T005",
    nasabahId: "N001",
    nasabahNama: "Budi Santoso",
    jenisAmpah: "Botol Kaca",
    berat: 1.2,
    satuan: "kg",
    nilaiTukar: 240,
    tanggal: "2024-04-09",
    waktu: "14:30",
    status: "selesai",
  },
  {
    id: "T006",
    nasabahId: "N005",
    nasabahNama: "Roni Wijaya",
    jenisAmpah: "Plastik Lainnya",
    berat: 0.8,
    satuan: "kg",
    nilaiTukar: 160,
    tanggal: "2024-04-08",
    waktu: "15:45",
    status: "pending",
  },
  {
    id: "T007",
    nasabahId: "N002",
    nasabahNama: "Siti Nurhaliza",
    jenisAmpah: "Kertas Kardus",
    berat: 2.0,
    satuan: "kg",
    nilaiTukar: 400,
    tanggal: "2024-04-08",
    waktu: "10:00",
    status: "selesai",
  },
  {
    id: "T008",
    nasabahId: "N003",
    nasabahNama: "Ahmad Hidayat",
    jenisAmpah: "Plastik PET",
    berat: 1.5,
    satuan: "kg",
    nilaiTukar: 300,
    tanggal: "2024-04-07",
    waktu: "12:15",
    status: "dibatalkan",
  },
];

export type WasteType = {
  id: string;
  nama: string;
  hargaPerKg: number; // dalam point
  icon: string;
  warna: string;
};

export const wasteTypes: WasteType[] = [
  {
    id: "W001",
    nama: "Plastik PET",
    hargaPerKg: 200,
    icon: "🔵",
    warna: "bg-blue-100",
  },
  {
    id: "W002",
    nama: "Kertas",
    hargaPerKg: 200,
    icon: "📄",
    warna: "bg-yellow-100",
  },
  {
    id: "W003",
    nama: "Aluminium",
    hargaPerKg: 1600,
    icon: "💎",
    warna: "bg-gray-100",
  },
  {
    id: "W004",
    nama: "Logam Besi",
    hargaPerKg: 200,
    icon: "⚙️",
    warna: "bg-slate-100",
  },
  {
    id: "W005",
    nama: "Botol Kaca",
    hargaPerKg: 200,
    icon: "🍾",
    warna: "bg-green-100",
  },
  {
    id: "W006",
    nama: "Plastik Lainnya",
    hargaPerKg: 200,
    icon: "🔴",
    warna: "bg-red-100",
  },
  {
    id: "W007",
    nama: "Kertas Kardus",
    hargaPerKg: 200,
    icon: "📦",
    warna: "bg-orange-100",
  },
];
