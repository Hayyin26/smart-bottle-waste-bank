"use client";

import { useState } from "react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { userTransactions } from "@/data/banking-transactions";
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Search,
  Download,
} from "lucide-react";
import Link from "next/link";

type TransactionType = "All" | "Transfer" | "Deposit" | "Withdrawal";

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<TransactionType>("All");
  const [dateFilter, setDateFilter] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTransactionIcon = (type: string) => {
    return type === "Transfer" || type === "Withdrawal" ? (
      <ArrowUpRight className="h-5 w-5" />
    ) : (
      <ArrowDownLeft className="h-5 w-5" />
    );
  };

  const getTransactionColor = (type: string) => {
    return type === "Transfer" || type === "Withdrawal"
      ? "text-red-600 bg-red-100"
      : "text-green-600 bg-green-100";
  };

  const filteredTransactions = userTransactions.filter((tx) => {
    const matchType = filterType === "All" || tx.type === filterType;
    const matchSearch =
      tx.toName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.includes(searchTerm);
    const matchDate = !dateFilter || tx.date === dateFilter;
    return matchType && matchSearch && matchDate;
  });

  return (
    <div className="min-h-screen">
      <Container className="py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Transaction History</h1>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Filters */}
          <div className="rounded-lg border border-border bg-background p-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search recipient or transaction ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-border pl-10 pr-3 py-2"
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-lg border border-border pl-10 pr-3 py-2"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 flex-wrap">
              {(["All", "Transfer", "Deposit", "Withdrawal"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`rounded-lg px-4 py-2 font-medium transition-colors ${
                      filterType === type
                        ? "bg-blue-600 text-white"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {type}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="rounded-lg border border-border bg-background p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${getTransactionColor(
                          transaction.type
                        )}`}
                      >
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{transaction.toName}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.date} at {transaction.time}
                        </p>
                        {transaction.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {transaction.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {transaction.type === "Withdrawal" ? "-" : "+"}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            transaction.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : transaction.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.status}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {transaction.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-border bg-muted p-8 text-center">
                <p className="text-muted-foreground">
                  No transactions found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredTransactions.length > 10 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline">Previous</Button>
              <Button>1</Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">Next</Button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
