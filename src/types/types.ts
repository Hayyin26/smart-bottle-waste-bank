import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type TicketMetric = {
  date: string;
  type: "created" | "resolved";
  count: number;
};

export type BankAccount = {
  id: string;
  accountNumber: string;
  accountHolder: string;
  balance: number;
  accountType: "Savings" | "Checking";
  status: "Active" | "Inactive";
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  accounts: BankAccount[];
  kycStatus: "Verified" | "Pending" | "Rejected";
};

export type WasteUser = {
  id: string;
  nama: string;
  email: string;
  nomorHp: string;
  alamat: string;
  kecamatan: string;
  saldoPoint: number;
  totalTransaksi: number;
  terdaftar: string;
  status: "aktif" | "nonaktif";
};

export type Transaction = {
  id: string;
  fromAccount: string;
  toAccount: string;
  fromName: string;
  toName: string;
  amount: number;
  type: "Transfer" | "Deposit" | "Withdrawal";
  date: string;
  time: string;
  status: "Completed" | "Pending" | "Failed";
  description?: string;
};

