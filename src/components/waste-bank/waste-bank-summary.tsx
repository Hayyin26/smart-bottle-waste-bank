"use client";

import { getJenisSampahList } from "@/services/jenis-sampah.service";
import { getTransaksiList } from "@/services/transaksi.service";
import { getNasabahList } from "@/services/nasabah.service";
import { useState, useEffect } from "react";
import type { WasteType, WasteTransaction } from "@/data/waste-transactions";
import type { WasteUser } from "@/types/types";

export default function WasteBankSummary() {
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [wasteTransactions, setWasteTransactions] = useState<WasteTransaction[]>([]);
  const [nasabahList, setNasabahList] = useState<WasteUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [typesData, transaksiData, nasabahData] = await Promise.all([
        getJenisSampahList(),
        getTransaksiList(),
        getNasabahList(),
      ]);
      setWasteTypes(typesData);
      setWasteTransactions(transaksiData);
      setNasabahList(nasabahData);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Memuat ringkasan...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalUser = nasabahList.length;
  const totalUserAktif = nasabahList.filter(n => n.status === "aktif").length;
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
  const userTransactionCount = wasteTransactions.reduce((acc: Record<string, number>, t) => {
    acc[t.userId] = (acc[t.userId] || 0) + 1;
    return acc;
  }, {});

  const topUserId = Object.entries(userTransactionCount).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const topUser = nasabahList.find(n => n.id === topUserId);

  return (
    <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
      <h2 className="mb-6 text-xl font-semibold">Ringkasan Sistem</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Info */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Total User</p>
          <p className="text-3xl font-bold">{totalUser}</p>
          <p className="text-xs text-green-600">
            ✓ {totalUserAktif} aktif
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
            Rata-rata transaksi: {totalTransaksi > 0 ? Math.round(totalPointDistribusi / totalTransaksi) : 0} point
          </p>
        </div>

        {/* Most Active Waste Type */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Sampah Paling Banyak</p>
          <p className="text-2xl font-bold">{mostActiveWaste?.[0] || '-'}</p>
          <p className="text-xs text-orange-600">
            {mostActiveWaste?.[1] || 0} transaksi
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
          <p className="text-sm text-muted-foreground">User Top</p>
          <p className="text-lg font-bold">{topUser?.nama || '-'}</p>
          <p className="text-xs text-green-600">
            Saldo: {topUser?.saldoPoint.toLocaleString("id-ID") || 0} point
          </p>
        </div>
      </div>
    </div>
  );
}
