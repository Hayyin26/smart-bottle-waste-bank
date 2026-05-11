"use client";

import Container from "@/components/container";
import TransactionTable from "@/components/waste-bank/transaction-table";
import { getTransaksiList } from "@/services/transaksi.service";
import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import type { WasteTransaction } from "@/data/waste-transactions";
import { BOTTLE_CATEGORIES, type BottleType } from "@/utils/bottle-classifier";

export default function TransaksiPage() {
  const [wasteTransactions, setWasteTransactions] = useState<WasteTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"semua" | "selesai" | "pending" | "dibatalkan">("semua");
  const [filterCategory, setFilterCategory] = useState<"semua" | "KECIL" | "SEDANG" | "BESAR">("semua");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getTransaksiList();
      setWasteTransactions(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredTransactions = 
    filterStatus === "semua" && filterCategory === "semua"
      ? wasteTransactions
      : wasteTransactions.filter(t => {
          const statusMatch = filterStatus === "semua" || t.status === filterStatus;
          const categoryMatch = filterCategory === "semua" || t.jenisAmpah.includes(filterCategory);
          return statusMatch && categoryMatch;
        });

  const stats = {
    total: wasteTransactions.length,
    selesai: wasteTransactions.filter(t => t.status === "selesai").length,
    pending: wasteTransactions.filter(t => t.status === "pending").length,
    dibatalkan: wasteTransactions.filter(t => t.status === "dibatalkan").length,
    totalNilai: wasteTransactions
      .filter(t => t.status === "selesai")
      .reduce((total, t) => total + t.nilaiTukar, 0),
    totalBerat: wasteTransactions.reduce((total, t) => total + t.berat, 0),
    // Per kategori
    kecil: wasteTransactions.filter(t => t.jenisAmpah.includes('KECIL')).length,
    sedang: wasteTransactions.filter(t => t.jenisAmpah.includes('SEDANG')).length,
    besar: wasteTransactions.filter(t => t.jenisAmpah.includes('BESAR')).length,
  };

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

  return (
    <div className="space-y-6">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Transaksi</h1>
            <p className="text-muted-foreground">
              Total {stats.total} transaksi sampah tercatat
            </p>
          </div>
        </div>
      </Container>

      {/* Stats Cards */}
      <Container className="py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Total Transaksi</p>
            <p className="mt-2 text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Selesai</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{stats.selesai}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Total Point</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {stats.totalNilai.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Total Sampah</p>
            <p className="mt-2 text-2xl font-bold">{(stats.totalBerat / 1000).toFixed(1)} kg</p>
          </div>
        </div>
      </Container>

      {/* Category Breakdown */}
      <Container className="py-4">
        <h3 className="text-lg font-semibold mb-3">Breakdown per Kategori Botol</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {Object.entries(BOTTLE_CATEGORIES).map(([key, category]) => (
            <div key={key} className="rounded-lg border-2 p-3" style={{ borderColor: category.color, backgroundColor: `${category.color}15` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                <h4 className="font-semibold text-sm">{category.name}</h4>
              </div>
              <div className="text-sm space-y-1">
                <p><span className="text-muted-foreground">Transaksi:</span> <span className="font-bold">{stats[key.toLowerCase() as keyof typeof stats]}</span></p>
                <p><span className="text-muted-foreground">Range:</span> <span className="font-semibold text-xs">{category.minWeight}-{category.maxWeight}g</span></p>
                <p><span className="text-muted-foreground">Points:</span> <span className="font-semibold text-green-600">{category.points} pt/botol</span></p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Filter */}
      <Container className="py-4">
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filter Status:</span>
            <div className="flex gap-2">
              {["semua", "selesai", "pending", "dibatalkan"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as "selesai" | "pending" | "dibatalkan")}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filter Kategori Botol:</span>
            <div className="flex gap-2">
              {["semua", "KECIL", "SEDANG", "BESAR"].map((category) => {
                let bgColor = "bg-slate-100";
                let textColor = "text-slate-700";
                let activeBgColor = "bg-slate-600";
                
                if (filterCategory === category && category !== "semua") {
                  if (category === "KECIL") {
                    bgColor = "bg-blue-100";
                    textColor = "text-blue-700";
                    activeBgColor = "bg-blue-600";
                  } else if (category === "SEDANG") {
                    bgColor = "bg-green-100";
                    textColor = "text-green-700";
                    activeBgColor = "bg-green-600";
                  } else if (category === "BESAR") {
                    bgColor = "bg-amber-100";
                    textColor = "text-amber-700";
                    activeBgColor = "bg-amber-600";
                  }
                }
                
                return (
                  <button
                    key={category}
                    onClick={() => setFilterCategory(category as "semua" | "KECIL" | "SEDANG" | "BESAR")}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      filterCategory === category
                        ? `${activeBgColor} text-white`
                        : `${bgColor} ${textColor} hover:opacity-75 dark:bg-slate-800 dark:text-slate-300`
                    }`}
                  >
                    {category === "semua" ? "Semua" : category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>

      {/* Table */}
      <Container className="py-4">
        <TransactionTable transactions={filteredTransactions} />
      </Container>
    </div>
  );
}
