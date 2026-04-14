"use client";

import { wasteTypes } from "@/data/waste-transactions";

export default function WasteTypesList() {
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
