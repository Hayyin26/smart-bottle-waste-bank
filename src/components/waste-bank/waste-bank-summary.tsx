"use client";

import { wasteTypes, wasteTransactions } from "@/data/waste-transactions";
import { nasabahList } from "@/data/nasabah";

export default function WasteBankSummary() {
  // Calculate statistics
  const totalNasabah = nasabahList.length;
  const totalNasabahAktif = nasabahList.filter(n => n.status === "aktif").length;
  const totalTransaksi = wasteTransactions.length;
  const totalSampahDiolah = wasteTransactions.reduce((total, t) => total + t.berat, 0);
  const totalPointDistribusi = wasteTransactions
    .filter(t => t.status === "selesai")
    .reduce((total, t) => total + t.nilaiTukar, 0);

  // Most active waste type
  const wasteTypeCount = wasteTransactions.reduce((acc: Record<string, number>, t) => {
    acc[t.jenisAmpah] = (acc[t.jenisAmpah] || 0) + 1;
    return acc;
  }, {});

  const mostActiveWaste = Object.entries(wasteTypeCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // Top customer
  const nasabahTransactionCount = wasteTransactions.reduce((acc: Record<string, number>, t) => {
    acc[t.nasabahId] = (acc[t.nasabahId] || 0) + 1;
    return acc;
  }, {});

  const topNasabahId = Object.entries(nasabahTransactionCount).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const topNasabah = nasabahList.find(n => n.id === topNasabahId);

  return (
    <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
      <h2 className="mb-6 text-xl font-semibold">Ringkasan Sistem</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Nasabah Info */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Nasabah</p>
          <p className="text-3xl font-bold">{totalNasabah}</p>
          <p className="text-xs text-green-600">
            ✓ {totalNasabahAktif} aktif
          </p>
        </div>

        {/* Transaction Info */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total Transaksi</p>
          <p className="text-3xl font-bold">{totalTransaksi}</p>
          <p className="text-xs text-blue-600">
            Total sampah: {totalSampahDiolah.toFixed(2)} kg
          </p>
        </div>

        {/* Point Distribution */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Point Terdistribusi</p>
          <p className="text-3xl font-bold text-green-600">
            {totalPointDistribusi.toLocaleString("id-ID")}
          </p>
          <p className="text-xs text-purple-600">
            Rata-rata transaksi: {Math.round(totalPointDistribusi / totalTransaksi)} point
          </p>
        </div>

        {/* Most Active Waste Type */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Sampah Paling Banyak</p>
          <p className="text-2xl font-bold">{mostActiveWaste?.[0]}</p>
          <p className="text-xs text-orange-600">
            {mostActiveWaste?.[1]} transaksi
          </p>
        </div>

        {/* Waste Types Available */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Jenis Sampah Terdaftar</p>
          <p className="text-3xl font-bold">{wasteTypes.length}</p>
          <p className="text-xs text-gray-600">
            Tipe sampah yang bisa ditukar
          </p>
        </div>

        {/* Top Customer */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Nasabah Top</p>
          <p className="text-lg font-bold">{topNasabah?.nama}</p>
          <p className="text-xs text-green-600">
            Saldo: {topNasabah?.saldoPoint.toLocaleString("id-ID")} point
          </p>
        </div>
      </div>
    </div>
  );
}
