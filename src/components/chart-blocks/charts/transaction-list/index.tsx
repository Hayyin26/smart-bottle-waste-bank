"use client";

import { Search } from "lucide-react";
import { transactions } from "@/data/transactions";
import ChartTitle from "../../components/chart-title";
import TransactionRow from "./components/transaction-row";

export default function TransactionList() {
  return (
    <section className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <ChartTitle title="Recent Transactions" />
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search transactions..."
            className="w-48 border-none bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Transaction ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">
                Amount
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                Bottles
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {transactions.length} transactions</span>
        <div className="flex gap-2">
          <button className="rounded-lg border border-border px-3 py-2 hover:bg-muted">
            Previous
          </button>
          <button className="rounded-lg border border-border bg-primary px-3 py-2 text-primary-foreground">
            1
          </button>
          <button className="rounded-lg border border-border px-3 py-2 hover:bg-muted">
            2
          </button>
          <button className="rounded-lg border border-border px-3 py-2 hover:bg-muted">
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
