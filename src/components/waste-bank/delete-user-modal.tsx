"use client";

import type { WasteUser } from "@/types/types";
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

interface DeleteUserModalProps {
  user: WasteUser;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteUserModal({ user, onClose, onSuccess }: DeleteUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (confirmText.toLowerCase() !== "hapus") {
      setError('Ketik "hapus" untuk mengkonfirmasi penghapusan');
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menghapus user");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menghapus user");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-600" />
            <h2 className="text-lg font-bold">Hapus User</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Warning Message */}
        <div className="mb-4 space-y-3">
          <p className="text-sm text-foreground">
            Anda akan menghapus user <strong>{user.nama}</strong>
          </p>
          <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-100">
            ⚠️ Tindakan ini akan menghapus semua data user termasuk akun, profile, dan riwayat transaksi. Tindakan ini tidak dapat dibatalkan.
          </div>
        </div>

        {/* Confirmation Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Ketik <strong>"hapus"</strong> untuk mengkonfirmasi:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder='Ketik "hapus"'
            disabled={loading}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700"
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900 dark:text-red-100 mb-4">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 dark:bg-slate-800 dark:border-slate-700"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText.toLowerCase() !== "hapus"}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Menghapus..." : "Hapus User"}
          </button>
        </div>
      </div>
    </div>
  );
}
