"use client";

import { Trash2, Users, TrendingUp } from "lucide-react";

interface WasteBankStatsProps {
  totalNasabah: number;
  totalTransaksi: number;
  totalSampahDiolah: number; // dalam kg
  totalPointDistribusi: number;
}

export default function WasteBankStats({
  totalNasabah,
  totalTransaksi,
  totalSampahDiolah,
  totalPointDistribusi,
}: WasteBankStatsProps) {
  const stats = [
    {
      icon: Users,
      label: "Total Nasabah",
      value: totalNasabah,
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: TrendingUp,
      label: "Total Transaksi",
      value: totalTransaksi,
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Trash2,
      label: "Total Sampah Diolah",
      value: `${totalSampahDiolah} kg`,
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: TrendingUp,
      label: "Point Terdistribusi",
      value: totalPointDistribusi.toLocaleString("id-ID"),
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const StatIcon = stat.icon;
        return (
          <div
            key={index}
            className="rounded-lg border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.color}`}>
                <StatIcon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
