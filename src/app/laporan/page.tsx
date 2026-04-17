"use client";

import Container from "@/components/container";
import { BarChart3, TrendingUp, Trash2, Users } from "lucide-react";
import { wasteTransactions } from "@/data/waste-transactions";
import { nasabahList } from "@/data/nasabah";

export default function LaporanPage() {
  // Calculate statistics
  const totalUser = nasabahList.length;
  const totalUserAktif = nasabahList.filter(n => n.status === "aktif").length;
  const totalTransaksi = wasteTransactions.length;
  const totalSampahDiolah = wasteTransactions.reduce((total, t) => total + t.berat, 0);
  const totalPointDistribusi = wasteTransactions
    .filter(t => t.status === "selesai")
    .reduce((total, t) => total + t.nilaiTukar, 0);

  // Waste type statistics
  const wasteTypeStats = wasteTransactions.reduce((acc: Record<string, { count: number; totalBerat: number }>, t) => {
    if (!acc[t.jenisAmpah]) {
      acc[t.jenisAmpah] = { count: 0, totalBerat: 0 };
    }
    acc[t.jenisAmpah].count += 1;
    acc[t.jenisAmpah].totalBerat += t.berat;
    return acc;
  }, {});

  // User statistics
  const userStats = nasabahList.map(n => {
    const transactions = wasteTransactions.filter(t => t.userId === n.id);
    const totalPoint = transactions
      .filter(t => t.status === "selesai")
      .reduce((total, t) => total + t.nilaiTukar, 0);
    const totalBerat = transactions.reduce((total, t) => total + t.berat, 0);
    return {
      ...n,
      transactionCount: transactions.length,
      totalPoint,
      totalBerat,
    };
  }).sort((a, b) => b.transactionCount - a.transactionCount);

  // Monthly statistics (simulated)
  const monthlyData = [
    { bulan: "Januari", transaksi: 8, sampah: 12.5, point: 2000 },
    { bulan: "Februari", transaksi: 12, sampah: 18.3, point: 3200 },
    { bulan: "Maret", transaksi: 10, sampah: 15.2, point: 2800 },
    { bulan: "April", transaksi: wasteTransactions.length, sampah: totalSampahDiolah, point: totalPointDistribusi },
  ];

  return (
    <div className="space-y-6">
      <Container className="py-4">
        <div>
          <h1 className="text-3xl font-bold">Laporan Bank Sampah</h1>
          <p className="text-muted-foreground">
            Analisis dan statistik sistem bank sampah digital
          </p>
        </div>
      </Container>

      {/* Key Metrics */}
      <Container className="py-4">
        <h2 className="mb-4 text-xl font-semibold">Metrik Utama</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total User</p>
                <p className="mt-2 text-2xl font-bold">{totalUser}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="mt-2 text-xs text-green-600">✓ {totalUserAktif} aktif</p>
          </div>

          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <p className="mt-2 text-2xl font-bold">{totalTransaksi}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
            <p className="mt-2 text-xs text-gray-600">Rata-rata per user: {(totalTransaksi / totalUser).toFixed(1)}</p>
          </div>

          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sampah</p>
                <p className="mt-2 text-2xl font-bold">{totalSampahDiolah.toFixed(1)} kg</p>
              </div>
              <Trash2 className="h-8 w-8 text-orange-500" />
            </div>
            <p className="mt-2 text-xs text-gray-600">Rata-rata: {(totalSampahDiolah / totalTransaksi).toFixed(2)} kg/transaksi</p>
          </div>

          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Point Terdistribusi</p>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {totalPointDistribusi.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
            <p className="mt-2 text-xs text-gray-600">Rata-rata: {Math.round(totalPointDistribusi / totalTransaksi)} point/transaksi</p>
          </div>
        </div>
      </Container>

      {/* Waste Type Statistics */}
      <Container className="py-4">
        <h2 className="mb-4 text-xl font-semibold">Statistik Jenis Sampah</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800">
                <th className="px-4 py-3 text-left text-sm font-semibold">Jenis Sampah</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Jumlah Transaksi</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total Berat (kg)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Rata-rata/Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(wasteTypeStats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([jenisAmpah, stat]) => (
                  <tr key={jenisAmpah} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-3 text-sm font-medium">{jenisAmpah}</td>
                    <td className="px-4 py-3 text-sm">{stat.count}</td>
                    <td className="px-4 py-3 text-sm">{stat.totalBerat.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">{(stat.totalBerat / stat.count).toFixed(2)} kg</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Top Nasabah */}
      <Container className="py-4">
        <h2 className="mb-4 text-xl font-semibold">Top 10 Nasabah</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800">
                <th className="px-4 py-3 text-left text-sm font-semibold">Peringkat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Transaksi</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total Sampah (kg)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total Point</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Saldo Saat Ini</th>
              </tr>
            </thead>
            <tbody>
              {userStats.slice(0, 10).map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 text-sm font-semibold">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{user.nama}</td>
                  <td className="px-4 py-3 text-sm">{user.transactionCount}</td>
                  <td className="px-4 py-3 text-sm">{user.totalBerat.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-semibold">{user.totalPoint.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm font-semibold">{user.saldoPoint.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      {/* Monthly Trends */}
      <Container className="py-4">
        <h2 className="mb-4 text-xl font-semibold">Tren Bulanan</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800">
                <th className="px-4 py-3 text-left text-sm font-semibold">Bulan</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Transaksi</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Sampah (kg)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Point Distribusi</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data) => (
                <tr key={data.bulan} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-4 py-3 text-sm font-medium">{data.bulan}</td>
                  <td className="px-4 py-3 text-sm">{data.transaksi}</td>
                  <td className="px-4 py-3 text-sm">{data.sampah.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-semibold">{data.point.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </div>
  );
}
