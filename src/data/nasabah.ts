export type Nasabah = {
  id: string;
  nama: string;
  email: string;
  nomorHp: string;
  alamat: string;
  kelurahan: string;
  kecamatan: string;
  saldoPoint: number;
  totalTransaksi: number;
  terdaftar: string;
  status: "aktif" | "nonaktif";
};

export const nasabahList: Nasabah[] = [
  {
    id: "N001",
    nama: "Budi Santoso",
    email: "budi@email.com",
    nomorHp: "08123456789",
    alamat: "Jl. Merdeka No. 45",
    kelurahan: "Karikatan",
    kecamatan: "Bandung Wetan",
    saldoPoint: 12500,
    totalTransaksi: 24,
    terdaftar: "2024-01-15",
    status: "aktif",
  },
  {
    id: "N002",
    nama: "Siti Nurhaliza",
    email: "siti@email.com",
    nomorHp: "08234567891",
    alamat: "Jl. Gatot Subroto No. 78",
    kelurahan: "Neglasari",
    kecamatan: "Bandung Kulon",
    saldoPoint: 8750,
    totalTransaksi: 15,
    terdaftar: "2024-02-20",
    status: "aktif",
  },
  {
    id: "N003",
    nama: "Ahmad Hidayat",
    email: "ahmad@email.com",
    nomorHp: "08345678912",
    alamat: "Jl. Pendidikan No. 12",
    kelurahan: "Tamansari",
    kecamatan: "Bandung Utara",
    saldoPoint: 5200,
    totalTransaksi: 8,
    terdaftar: "2024-03-10",
    status: "aktif",
  },
  {
    id: "N004",
    nama: "Eka Putri",
    email: "eka@email.com",
    nomorHp: "08456789123",
    alamat: "Jl. Ahmad Yani No. 56",
    kelurahan: "Cibeunying Kidul",
    kecamatan: "Bandung Selatan",
    saldoPoint: 15800,
    totalTransaksi: 32,
    terdaftar: "2024-01-05",
    status: "aktif",
  },
  {
    id: "N005",
    nama: "Roni Wijaya",
    email: "roni@email.com",
    nomorHp: "08567891234",
    alamat: "Jl. Cihampelas No. 89",
    kelurahan: "Cipaganti",
    kecamatan: "Bandung Wetan",
    saldoPoint: 3400,
    totalTransaksi: 5,
    terdaftar: "2024-04-22",
    status: "nonaktif",
  },
];
