"use client";

import Container from "@/components/container";
import TransactionList from "@/components/iot/transaction-list";
import { getTransactions, getTotalTransactions, getTotalPointsDistributed } from "@/services/transactions.service";
import { useState, useEffect } from "react";
import { Activity, Award, Calendar } from "lucide-react";

export default function HistoryPage() {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalPoints: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    const [transactions, points] = await Promise.all([
      getTotalTransactions(),
      getTotalPointsDistributed(),
    ]);
    
    setStats({
      totalTransactions: transactions,
      totalPoints: points,
    });
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Memuat history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Container className="py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Transaction History</h1>
            <p className="text-muted-foreground">
              Semua transaksi scan QR code
            </p>
          </div>
        </div>
      </Container>

      {/* Stats Cards */}
      <Container className="py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Scans</p>
                <p className="mt-2 text-3xl font-bold">{stats.totalTransactions}</p>
              </div>
              <div className="rounded-lg p-3 bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                <Activity size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {stats.totalPoints.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg p-3 bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                <Award size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Points/Scan</p>
                <p className="mt-2 text-3xl font-bold text-purple-600">
                  {stats.totalTransactions > 0 
                    ? Math.round(stats.totalPoints / stats.totalTransactions)
                    : 0}
                </p>
              </div>
              <div className="rounded-lg p-3 bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
                <Calendar size={24} />
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Transaction List */}
      <Container className="py-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Transactions</h2>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live Updates
            </span>
          </div>
          <TransactionList limit={50} />
        </div>
      </Container>
    </div>
  );
}
