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

export const wasteTransactions: WasteTransaction[] = [
  {
    id: "T001",
    userId: "U001",
    userName: "Budi Santoso",
    jenisAmpah: "Botol Plastik Kecil",
    berat: 2.5,
    satuan: "kg",
    nilaiTukar: 500,
    tanggal: "2024-04-10",
    waktu: "10:30",
    status: "selesai",
  },
  {
    id: "T002",
    userId: "U002",
    userName: "Siti Nurhaliza",
    jenisAmpah: "Botol Plastik Sedang",
    berat: 1.8,
    satuan: "kg",
    nilaiTukar: 360,
    tanggal: "2024-04-10",
    waktu: "11:15",
    status: "selesai",
  },
  {
    id: "T003",
    userId: "U003",
    userName: "Ahmad Hidayat",
    jenisAmpah: "Botol Plastik Besar",
    berat: 0.5,
    satuan: "kg",
    nilaiTukar: 800,
    tanggal: "2024-04-10",
    waktu: "13:45",
    status: "selesai",
  },
  {
    id: "T004",
    userId: "U004",
    userName: "Eka Putri",
    jenisAmpah: "Botol Plastik Besar",
    berat: 3.2,
    satuan: "kg",
    nilaiTukar: 640,
    tanggal: "2024-04-09",
    waktu: "09:20",
    status: "selesai",
  },
  {
    id: "T005",
    userId: "U001",
    userName: "Budi Santoso",
    jenisAmpah: "Botol Plastik Sedang",
    berat: 1.2,
    satuan: "kg",
    nilaiTukar: 240,
    tanggal: "2024-04-09",
    waktu: "14:30",
    status: "selesai",
  },
  {
    id: "T006",
    userId: "U005",
    userName: "Roni Wijaya",
    jenisAmpah: "Botol Plastik Kecil",
    berat: 0.8,
    satuan: "kg",
    nilaiTukar: 160,
    tanggal: "2024-04-08",
    waktu: "15:45",
    status: "pending",
  },
  {
    id: "T007",
    userId: "U002",
    userName: "Siti Nurhaliza",
    jenisAmpah: "Botol Plastik Besar",
    berat: 2.0,
    satuan: "kg",
    nilaiTukar: 400,
    tanggal: "2024-04-08",
    waktu: "10:00",
    status: "selesai",
  },
  {
    id: "T008",
    userId: "U003",
    userName: "Ahmad Hidayat",
    jenisAmpah: "Botol Plastik Kecil",
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
    nama: "Botol Plastik Kecil",
    hargaPerKg: 200,
    icon: "🔵",
    warna: "bg-blue-100",
  },
  {
    id: "W002",
    nama: "Botol Plastik Sedang",
    hargaPerKg: 200,
    icon: "🟦",
    warna: "bg-blue-200",
  },
  {
    id: "W003",
    nama: "Botol Plastik Besar",
    hargaPerKg: 1600,
    icon: "🟦",
    warna: "bg-blue-300",
  },
];
