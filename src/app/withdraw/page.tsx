"use client";

import { useState } from "react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { currentUserAccount } from "@/data/user";
import { ArrowLeft, CheckCircle, MapPin } from "lucide-react";
import Link from "next/link";

export default function WithdrawPage() {
  const [step, setStep] = useState<"method" | "amount" | "confirm" | "success">("method");
  const [method, setMethod] = useState("atm");
  const [amount, setAmount] = useState(0);

  const handleWithdraw = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStep("success");
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const withdrawMethods = [
    {
      id: "atm",
      name: "ATM Withdrawal",
      desc: "Withdraw from any ATM",
      icon: "🏧",
      fee: 0,
    },
    {
      id: "branch",
      name: "Branch Counter",
      desc: "Withdraw at our branch",
      icon: "🏦",
      fee: 0,
    },
    {
      id: "agent",
      name: "Agent/Merchant",
      desc: "Withdraw through partner",
      icon: "🤝",
      fee: 2500,
    },
  ];

  return (
    <div className="min-h-screen">
      <Container className="py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Withdraw Money</h1>
          </div>

          {/* Current Balance */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-sm text-blue-600">Available Balance</p>
            <p className="text-2xl font-bold text-blue-900">
              {formatCurrency(currentUserAccount.balance)}
            </p>
          </div>

          {step === "method" && (
            <div className="space-y-4 rounded-lg border border-border bg-background p-6">
              <h2 className="text-lg font-semibold">Select Withdrawal Method</h2>
              <div className="grid gap-3">
                {withdrawMethods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setMethod(m.id);
                      setStep("amount");
                    }}
                    className={`rounded-lg border p-4 text-left transition-all ${
                      method === m.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{m.name}</p>
                        <p className="text-sm text-muted-foreground">{m.desc}</p>
                      </div>
                      <div>
                        <span className="text-2xl">{m.icon}</span>
                        {m.fee > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Fee: {formatCurrency(m.fee)}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === "amount" && (
            <div className="space-y-6 rounded-lg border border-border bg-background p-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Amount to Withdraw</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Rp
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-lg border border-border pl-10 pr-3 py-3 text-right text-lg font-semibold"
                  />
                </div>
              </div>

              {method === "branch" && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Select Branch</label>
                  <div className="space-y-2">
                    {["Main Branch - Jakarta", "Bandung Branch", "Surabaya Branch"].map(
                      (branch) => (
                        <button
                          key={branch}
                          className="w-full rounded-lg border border-border p-3 text-left hover:bg-muted flex items-center gap-2"
                        >
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {branch}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount</span>
                  <span className="font-semibold">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Fee</span>
                  <span className="font-semibold">
                    {formatCurrency(
                      withdrawMethods.find((m) => m.id === method)?.fee || 0
                    )}
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between text-sm font-bold">
                  <span>Total</span>
                  <span>
                    {formatCurrency(
                      amount + (withdrawMethods.find((m) => m.id === method)?.fee || 0)
                    )}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("method")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep("confirm")}
                  disabled={!amount || amount > currentUserAccount.balance}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6 rounded-lg border border-border bg-background p-6">
              <h2 className="text-lg font-semibold">Confirm Withdrawal</h2>
              <div className="space-y-3">
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium">
                    {withdrawMethods.find((m) => m.id === method)?.name}
                  </span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-bold text-lg">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Charge</span>
                  <span className="font-medium">
                    {formatCurrency(
                      amount + (withdrawMethods.find((m) => m.id === method)?.fee || 0)
                    )}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  I understand that I am withdrawing from my account and will receive the
                  amount in cash.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep("amount")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={handleWithdraw} className="flex-1">
                  Confirm & Withdraw
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Withdrawal Approved!
                </h2>
                <p className="text-green-700">
                  You can now withdraw{" "}
                  <span className="font-bold">{formatCurrency(amount)}</span>
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Reference Number</span>
                  <span className="font-mono">WTH-2024-001</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Method</span>
                  <span>
                    {withdrawMethods.find((m) => m.id === method)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valid Until</span>
                  <span>
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(
                      "id-ID"
                    )}
                  </span>
                </div>
              </div>

              <Link href="/">
                <Button className="w-full">Back to Dashboard</Button>
              </Link>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
