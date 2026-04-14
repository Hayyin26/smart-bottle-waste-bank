"use client";

import { Nasabah } from "@/data/nasabah";

interface NasabahTableProps {
  nasabahList: Nasabah[];
}

export default function NasabahTable({ nasabahList }: NasabahTableProps) {
  const getStatusColor = (status: string) => {
    return status === "aktif" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-slate-50 dark:bg-slate-800">
            <th className="px-4 py-3 text-left text-sm font-semibold">No.</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">No. HP</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Kelurahan</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Saldo Point</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Total Transaksi</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {nasabahList.map((nasabah, index) => (
            <tr 
              key={nasabah.id} 
              className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <td className="px-4 py-3 text-sm">{index + 1}</td>
              <td className="px-4 py-3 text-sm font-medium">{nasabah.nama}</td>
              <td className="px-4 py-3 text-sm text-muted-foreground">{nasabah.email}</td>
              <td className="px-4 py-3 text-sm">{nasabah.nomorHp}</td>
              <td className="px-4 py-3 text-sm">{nasabah.kelurahan}</td>
              <td className="px-4 py-3 text-sm font-semibold text-green-600">
                {nasabah.saldoPoint.toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm text-center">{nasabah.totalTransaksi}</td>
              <td className="px-4 py-3 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(nasabah.status)}`}>
                  {nasabah.status === "aktif" ? "Aktif" : "Nonaktif"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
