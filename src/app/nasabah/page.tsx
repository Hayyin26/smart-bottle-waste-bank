"use client";

import Container from "@/components/container";
import NasabahTable from "@/components/waste-bank/nasabah-table";
import { nasabahList } from "@/data/nasabah";
import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";

export default function NasabahPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"semua" | "aktif" | "nonaktif">("semua");

  const filteredNasabah = nasabahList.filter((nasabah) => {
    const matchesSearch =
      nasabah.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nasabah.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nasabah.nomorHp.includes(searchTerm);

    const matchesFilter =
      filterStatus === "semua" || nasabah.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: nasabahList.length,
    aktif: nasabahList.filter(n => n.status === "aktif").length,
    nonaktif: nasabahList.filter(n => n.status === "nonaktif").length,
    totalSaldo: nasabahList.reduce((total, n) => total + n.saldoPoint, 0),
    totalTransaksi: nasabahList.reduce((total, n) => total + n.totalTransaksi, 0),
  };

  return (
    <div className="space-y-6">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manajemen Nasabah</h1>
            <p className="text-muted-foreground">
              Total {stats.total} nasabah terdaftar
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            Tambah Nasabah
          </button>
        </div>
      </Container>

      {/* Stats Cards */}
      <Container className="py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Total Nasabah</p>
            <p className="mt-2 text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Aktif</p>
            <p className="mt-2 text-2xl font-bold text-green-600">{stats.aktif}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Nonaktif</p>
            <p className="mt-2 text-2xl font-bold text-gray-600">{stats.nonaktif}</p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Total Saldo Point</p>
            <p className="mt-2 text-2xl font-bold text-green-600">
              {stats.totalSaldo.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-white p-4 dark:bg-slate-900">
            <p className="text-sm text-muted-foreground">Total Transaksi</p>
            <p className="mt-2 text-2xl font-bold">{stats.totalTransaksi}</p>
          </div>
        </div>
      </Container>

      {/* Search and Filter */}
      <Container className="py-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, atau nomor HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-border bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700"
            />
          </div>

          {/* Filter Status */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <span className="text-sm font-medium">Filter Status:</span>
            <div className="flex gap-2">
              {["semua", "aktif", "nonaktif"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus("aktif" as const)}
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
        </div>
      </Container>

      {/* Results Count */}
      <Container className="py-0">
        <p className="text-sm text-muted-foreground">
          Menampilkan {filteredNasabah.length} dari {nasabahList.length} nasabah
        </p>
      </Container>

      {/* Table */}
      <Container className="py-4">
        <NasabahTable nasabahList={filteredNasabah} />
      </Container>
    </div>
  );
}
