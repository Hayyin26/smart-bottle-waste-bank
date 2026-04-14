import { Eye, EyeOff, CreditCard } from "lucide-react";
import type { BankAccount } from "@/types/types";
import { useState } from "react";

interface BalanceCardProps {
  account: BankAccount;
}

export default function BalanceCard({ account }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maskedAccountNumber = `•••• •••• •••• ${account.accountNumber.slice(-4)}`;

  return (
    <div className="relative h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-900 p-6 text-white shadow-lg">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white" />
        <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-white" />
      </div>

      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-90">Account Balance</p>
            <p className="text-xs opacity-75">{account.accountType} Account</p>
          </div>
          <CreditCard className="h-8 w-8" />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90 mb-2">Total Balance</p>
              <div className="flex items-center gap-2">
                <h2 className="text-4xl font-bold">
                  {showBalance ? formatCurrency(account.balance) : "••••••••"}
                </h2>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="rounded-full p-2 hover:bg-white/20 transition-colors"
                >
                  {showBalance ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs opacity-75">Card Number</p>
            <p className="font-mono text-sm">{maskedAccountNumber}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs opacity-75">Account Holder</p>
            <p className="text-sm font-medium">{account.accountHolder}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
