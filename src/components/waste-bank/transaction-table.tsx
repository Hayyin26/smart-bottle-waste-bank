"use client";

import type { WasteTransaction } from "@/data/waste-transactions";
import { BOTTLE_CATEGORIES } from "@/utils/bottle-classifier";

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
    return statusMap[status] || statusMap.pending;
  };

  // Get category color untuk jenis sampah/kategori botol
  const getCategoryColor = (jenisAmpah: string) => {
    if (jenisAmpah.includes('SEDANG')) return '#10B981'; // green
    if (jenisAmpah.includes('BESAR')) return '#F59E0B'; // amber
    return '#3B82F6'; // blue (default KECIL)
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-slate-50 dark:bg-slate-800">
            <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Kategori Botol</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Berat (gram)</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Point</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Waktu</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            const badge = getStatusBadge(transaction.status);
            const categoryColor = getCategoryColor(transaction.jenisAmpah);
            
            return (
              <tr 
                key={transaction.id} 
                className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-muted-foreground">#{transaction.id}</td>
                <td className="px-4 py-3 text-sm">{transaction.userName}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: categoryColor }}
                    />
                    <span className="font-semibold">{transaction.jenisAmpah}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold">{transaction.berat.toFixed(1)}g</td>
                <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                  {transaction.nilaiTukar.toLocaleString()} pt
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
