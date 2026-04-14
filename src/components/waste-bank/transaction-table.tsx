"use client";

import { WasteTransaction } from "@/data/waste-transactions";

interface TransactionTableProps {
  transactions: WasteTransaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      selesai: { bg: "bg-green-100", text: "text-green-800", label: "Selesai" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending" },
      dibatalkan: { bg: "bg-red-100", text: "text-red-800", label: "Dibatalkan" },
    };
    const badge = statusMap[status] || statusMap.pending;
    return badge;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-slate-50 dark:bg-slate-800">
            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Nasabah</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Jenis Sampah</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Berat (kg)</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Nilai Tukar (Point)</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Waktu</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const badge = getStatusBadge(transaction.status);
            return (
              <tr 
                key={transaction.id} 
                className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium">{transaction.id}</td>
                <td className="px-4 py-3 text-sm">{transaction.nasabahNama}</td>
                <td className="px-4 py-3 text-sm">{transaction.jenisAmpah}</td>
                <td className="px-4 py-3 text-sm font-semibold">{transaction.berat}</td>
                <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                  {transaction.nilaiTukar.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm">{transaction.tanggal}</td>
                <td className="px-4 py-3 text-sm">{transaction.waktu}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
