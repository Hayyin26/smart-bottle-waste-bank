import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, MoreHorizontal } from "lucide-react";
import type { Transaction } from "@/types/types";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const transactionIcons = {
  Transfer: ArrowUpRight,
  Deposit: ArrowDownLeft,
  Withdrawal: ArrowUpRight,
};

const transactionColors = {
  Transfer: "text-blue-600 bg-blue-100",
  Deposit: "text-green-600 bg-green-100",
  Withdrawal: "text-red-600 bg-red-100",
};

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    const Icon = transactionIcons[type];
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recent Transactions</h3>
        <Link href="/history" className="text-sm text-blue-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 5).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between rounded-lg border border-border bg-background p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${transactionColors[transaction.type]}`}
              >
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium">
                  {transaction.type === "Transfer"
                    ? transaction.toName
                    : transaction.type === "Deposit"
                      ? "Deposit"
                      : "Withdrawal"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {transaction.date} at {transaction.time}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold">
                  {transaction.type === "Withdrawal" ? "-" : "+"}
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {transaction.status}
                </p>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
