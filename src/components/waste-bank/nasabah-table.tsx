"use client";

import type { WasteUser } from "@/types/types";
import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import EditUserModal from "./edit-user-modal";
import DeleteUserModal from "./delete-user-modal";

interface UserTableProps {
  userList: WasteUser[];
  onRefresh?: () => void;
}

export default function UserTable({ userList, onRefresh }: UserTableProps) {
  const [editingUser, setEditingUser] = useState<WasteUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<WasteUser | null>(null);

  const getStatusColor = (status: string) => {
    return status === "aktif" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
  };

  const handleEditSuccess = () => {
    setEditingUser(null);
    onRefresh?.();
  };

  const handleDeleteSuccess = () => {
    setDeletingUser(null);
    onRefresh?.();
  };

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-border shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-slate-50 dark:bg-slate-800">
              <th className="px-4 py-3 text-left text-sm font-semibold">No.</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">No. HP</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Saldo Point</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Total Transaksi</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, index) => (
              <tr 
                key={user.id} 
                className="border-b hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <td className="px-4 py-3 text-sm">{index + 1}</td>
                <td className="px-4 py-3 text-sm font-medium">{user.nama}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 text-sm">{user.nomorHp}</td>
                <td className="px-4 py-3 text-sm font-semibold text-green-600">
                  {user.saldoPoint.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-center">{user.totalTransaksi}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                    {user.status === "aktif" ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-100"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingUser(user)}
                      className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-100"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Modal */}
      {deletingUser && (
        <DeleteUserModal 
          user={deletingUser} 
          onClose={() => setDeletingUser(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </>
  );
}
