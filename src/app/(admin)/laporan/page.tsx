"use client";

import Container from "@/components/container";
import { BarChart3, TrendingUp, Trash2, Users } from "lucide-react";
import { getNasabahList } from "@/services/nasabah.service";
import { getTransaksiList } from "@/services/transaksi.service";
import { useState, useEffect } from "react";
import type { WasteUser } from "@/types/types";
import type { WasteTransaction } from "@/data/waste-transactions";
import { BOTTLE_CATEGORIES, type BottleType } from "@/utils/bottle-classifier";

export default function LaporanPage() {
  const [nasabahList, setNasabahList] = useState<WasteUser[]>([]);
  const [wasteTransactions, setWasteTransactions] = useState<WasteTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [users, transactions] = await Promise.all([
        getNasabahList(),
        getTransaksiList(),
      ]);
      setNasabahList(users);
      setWasteTransactions(transactions);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalUser = nasabahList.length;
  const totalUserAktif = nasabahList.filter(n => n.status === "aktif").length;
  const totalTransaksi = wasteTransactions.length;
  
  // Calculate weight in grams (since now stored as gram, not kg)
  const totalSampahGram = wasteTransactions.reduce((total, t) => total + t.berat, 0);
  const totalSampahKg = totalSampahGram / 1000; // Convert to kg for display
  
  const totalPointDistribusi = wasteTransactions
    .filter(t => t.status === "selesai")
    .reduce((total, t) => total + t.nilaiTukar, 0);

  // Waste type statistics (now per kategori botol)
  const wasteTypeStats = wasteTransactions.reduce((acc: Record<string, { count: number; totalBerat: number; totalPoints: number }>, t) => {
    const bottleCategory = t.jenisAmpah; // e.g., "BOTOL KECIL", "BOTOL SEDANG", "BOTOL BESAR"
    
    if (!acc[bottleCategory]) {
      acc[bottleCategory] = { count: 0, totalBerat: 0, totalPoints: 0 };
    }
    acc[bottleCategory].count += 1;
    acc[bottleCategory].totalBerat += t.berat;
    acc[bottleCategory].totalPoints += t.nilaiTukar;
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
    { bulan: "April", transaksi: wasteTransactions.length, sampah: totalSampahKg, point: totalPointDistribusi },
  ];

  // Category breakdown untuk 3 kategori botol
  const categoryBreakdown = {
    KECIL: {
      ...BOTTLE_CATEGORIES.KECIL,
      count: 0,
      totalBerat: 0,
      totalPoints: 0,
    },
    SEDANG: {
      ...BOTTLE_CATEGORIES.SEDANG,
      count: 0,
      totalBerat: 0,
      totalPoints: 0,
    },
    BESAR: {
      ...BOTTLE_CATEGORIES.BESAR,
      count: 0,
      totalBerat: 0,
      totalPoints: 0,
    },
  };

  // Populate breakdown dari transactions
  wasteTransactions.forEach(t => {
    // Map from display name back to key
    let categoryKey: BottleType = 'KECIL';
    if (t.jenisAmpah.includes('SEDANG')) categoryKey = 'SEDANG';
    else if (t.jenisAmpah.includes('BESAR')) categoryKey = 'BESAR';
    
    if (categoryBreakdown[categoryKey]) {
      categoryBreakdown[categoryKey].count += 1;
      categoryBreakdown[categoryKey].totalBerat += t.berat;
      categoryBreakdown[categoryKey].totalPoints += t.nilaiTukar;
    }
  });

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
                <p className="mt-2 text-2xl font-bold">{totalSampahKg.toFixed(2)} kg</p>
              </div>
              <Trash2 className="h-8 w-8 text-orange-500" />
            </div>
            <p className="mt-2 text-xs text-gray-600">({totalSampahGram.toFixed(0)} gram)</p>
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

      {/* NOTE: Removed cards - switch to table-first design per user's request */}

      {/* Jenis Sampah Statistics (Per Kategori) - TABLE-FIRST */}
      <Container className="py-4">
        <h2 className="mb-4 text-xl font-semibold">Statistik Jenis Sampah (Per Kategori Botol)</h2>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-slate-50 dark:bg-slate-800">
                <th className="px-4 py-3 text-left text-sm font-semibold">Jenis Sampah</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Jumlah Transaksi</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total Berat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Total Points</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Range Berat</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Points/Botol</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Rata-rata/Transaksi</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(categoryBreakdown).map(([key, category]) => {
                const color = category.color || '#3B82F6';
                const count = category.count || 0;
                const totalBerat = category.totalBerat || 0; // grams
                const totalPoints = category.totalPoints || 0;
                const avgBeratPerTx = count > 0 ? (totalBerat / count) : 0; // grams
                const avgPointsPerTx = count > 0 ? Math.round(totalPoints / count) : 0;

                return (
                  <tr key={key} className="border-b hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-3 text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        {category.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{count}</td>
                    <td className="px-4 py-3 text-sm">{(totalBerat / 1000).toFixed(2)} kg ({totalBerat.toFixed(0)}g)</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-semibold">{totalPoints.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{category.minWeight}-{category.maxWeight} g</td>
                    <td className="px-4 py-3 text-sm">{category.points} pt</td>
                    <td className="px-4 py-3 text-sm">{(avgBeratPerTx / 1000).toFixed(2)} kg / {avgPointsPerTx} pt</td>
                  </tr>
                );
              })}
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
                  <td className="px-4 py-3 text-sm font-semibold">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm">{user.nama}</td>
                  <td className="px-4 py-3 text-sm">{user.transactionCount}</td>
                  <td className="px-4 py-3 text-sm">{(user.totalBerat / 1000).toFixed(2)}</td>
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
