"use client";

import Container from "@/components/container";
import WasteBankSummary from "@/components/waste-bank/waste-bank-summary";
import WasteBankStats from "@/components/waste-bank/waste-bank-stats";
import TransactionTable from "@/components/waste-bank/transaction-table";
import { nasabahList } from "@/data/nasabah";
import { wasteTransactions } from "@/data/waste-transactions";

export default function Home() {
  const totalUser = nasabahList.length;
  const totalTransaksi = wasteTransactions.length;
  const totalSampahDiolah = wasteTransactions.reduce((total, t) => total + t.berat, 0);
  const totalPointDistribusi = wasteTransactions
    .filter(t => t.status === "selesai")
    .reduce((total, t) => total + t.nilaiTukar, 0);

  // Get recent transactions
  const recentTransactions = wasteTransactions.slice(-5).reverse();

  return (
    <div className="space-y-6">
      <Container className="py-4">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Bank Sampah</h1>
            <p className="text-muted-foreground">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </Container>

      <Container className="py-4">
        <WasteBankStats
          totalUser={totalUser}
          totalTransaksi={totalTransaksi}
          totalSampahDiolah={totalSampahDiolah}
          totalPointDistribusi={totalPointDistribusi}
        />
      </Container>

      <Container className="py-4">
        <WasteBankSummary />
      </Container>

      <Container className="py-4">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Transaksi Terbaru</h2>
          <TransactionTable transactions={recentTransactions} />
        </div>
      </Container>
    </div>
  );
}
