"use client";

import { useState } from "react";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { savedContacts, currentUserAccount } from "@/data/user";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TransferPage() {
  const [step, setStep] = useState<"amount" | "confirm" | "success">("amount");
  const [selectedContact, setSelectedContact] = useState(savedContacts[0]);
  const [amount, setAmount] = useState(0);
  const [showNewAccount, setShowNewAccount] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");

  const handleTransfer = async () => {
    // Simulate API call
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
            <h1 className="text-3xl font-bold">Transfer Money</h1>
          </div>

          {step === "amount" && (
            <div className="space-y-6 rounded-lg border border-border bg-background p-6">
              {/* From Account */}
              <div>
                <label className="text-sm font-medium">From Account</label>
                <div className="mt-2 rounded-lg border border-border p-4 bg-muted">
                  <p className="font-medium">{currentUserAccount.accountHolder}</p>
                  <p className="text-sm text-muted-foreground">
                    Balance: {formatCurrency(currentUserAccount.balance)}
                  </p>
                </div>
              </div>

              {/* To Account */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Transfer To
                </label>
                {!showNewAccount ? (
                  <>
                    <div className="space-y-2 mb-4">
                      {savedContacts.map((contact) => (
                        <button
                          key={contact.id}
                          onClick={() => setSelectedContact(contact)}
                          className={`w-full rounded-lg border p-3 text-left transition-colors ${
                            selectedContact.id === contact.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-border hover:bg-muted"
                          }`}
                        >
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {contact.accountNumber}
                          </p>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowNewAccount(true)}
                      className="w-full rounded-lg border border-blue-500 py-2 text-blue-600 font-medium hover:bg-blue-50"
                    >
                      + Transfer to New Account
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter recipient name"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      className="w-full rounded-lg border border-border px-3 py-2 mb-2"
                    />
                    <input
                      type="text"
                      placeholder="Enter account number"
                      className="w-full rounded-lg border border-border px-3 py-2 mb-4"
                    />
                    <button
                      onClick={() => setShowNewAccount(false)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Use saved contact instead
                    </button>
                  </>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-medium mb-2 block">Amount</label>
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

              {/* Description */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description (optional)
                </label>
                <input
                  type="text"
                  placeholder="What's this transfer for?"
                  className="w-full rounded-lg border border-border px-3 py-2"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Link href="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button
                  onClick={() => setStep("confirm")}
                  disabled={!amount || (showNewAccount && !newRecipient)}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === "confirm" && (
            <div className="space-y-6 rounded-lg border border-border bg-background p-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Confirm Transfer</h2>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">From</span>
                    <span className="font-medium">
                      {currentUserAccount.accountHolder}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">To</span>
                    <span className="font-medium">
                      {selectedContact?.name || newRecipient}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-3">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fee</span>
                    <span className="font-medium">Free</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm">
                  I confirm that this transfer is correct and I authorize it.
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
                <Button onClick={handleTransfer} className="flex-1">
                  Confirm & Send
                </Button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="space-y-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <div>
                <h2 className="text-2xl font-bold text-green-900 mb-2">
                  Transfer Successful!
                </h2>
                <p className="text-green-700 mb-4">
                  Your transfer of{" "}
                  <span className="font-bold">{formatCurrency(amount)}</span> to{" "}
                  <span className="font-bold">
                    {selectedContact?.name || newRecipient}
                  </span>{" "}
                  has been sent.
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono">TXN-2024-001</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span>
                    {new Date().toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time</span>
                  <span>{new Date().toLocaleTimeString("id-ID")}</span>
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
