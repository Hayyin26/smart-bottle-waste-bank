"use client";

import Container from "@/components/container";
import TransactionTable from "@/components/waste-bank/transaction-table";
import { getTransaksiList } from "@/services/transaksi.service";
import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import type { WasteTransaction } from "@/data/waste-transactions";

export default function TransaksiPage() {
  const [wasteTransactions, setWasteTransactions] = useState<WasteTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"semua" | "selesai" | "pending" | "dibatalkan">("semua");

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
    filterStatus === "semua"
      ? wasteTransactions
      : wasteTransactions.filter(t => t.status === filterStatus);

  const stats = {
    total: wasteTransactions.length,
    selesai: wasteTransactions.filter(t => t.status === "selesai").length,
    pending: wasteTransactions.filter(t => t.status === "pending").length,
    dibatalkan: wasteTransactions.filter(t => t.status === "dibatalkan").length,
    totalNilai: wasteTransactions
      .filter(t => t.status === "selesai")
      .reduce((total, t) => total + t.nilaiTukar, 0),
    totalBerat: wasteTransactions.reduce((total, t) => total + t.berat, 0),
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
            <p className="mt-2 text-2xl font-bold">{stats.totalBerat.toFixed(1)} kg</p>
          </div>
        </div>
      </Container>

      {/* Filter */}
      <Container className="py-4">
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
      </Container>

      {/* Table */}
      <Container className="py-4">
        <TransactionTable transactions={filteredTransactions} />
      </Container>
    </div>
  );
}
