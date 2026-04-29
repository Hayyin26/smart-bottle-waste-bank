"use client";

import { getJenisSampahList } from "@/services/jenis-sampah.service";
import { useState, useEffect } from "react";
import type { WasteType } from "@/data/waste-transactions";

export default function WasteTypesList() {
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const data = await getJenisSampahList();
      setWasteTypes(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-sm text-muted-foreground">Memuat jenis sampah...</p>
      </div>
    );
  }

  if (wasteTypes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada jenis sampah terdaftar
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {wasteTypes.map((waste) => (
        <div
          key={waste.id}
          className={`rounded-lg border border-border p-4 ${waste.warna} hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{waste.nama}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {waste.hargaPerKg.toLocaleString()} point/kg
              </p>
            </div>
            <span className="text-3xl">{waste.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
