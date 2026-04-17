import type { User, BankAccount } from "@/types/types";

export const currentUserAccount: BankAccount = {
  id: "acc-001",
  accountNumber: "1234567890",
  accountHolder: "Ramadhani Bi Hayyin",
  balance: 25500000,
  accountType: "Savings",
  status: "Active",
};

export const currentUser: User = {
  id: "user-001",
  name: "Ramadhani Bi Hayyin",
  email: "ramadhani@smartbank.com",
  phone: "+62 812-3456-7890",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ramadhani",
  accounts: [currentUserAccount],
  kycStatus: "Verified",
};

export const savedContacts = [
  {
    id: "contact-001",
    name: "Ahmad Suryanto",
    accountNumber: "9876543210",
    bank: "Smart Bottle Waste Bank",
  },
  {
    id: "contact-002",
    name: "Siti Nurhaliza",
    accountNumber: "5432109876",
    bank: "Smart Bottle Waste Bank",
  },
  {
    id: "contact-003",
    name: "Budi Santoso",
    accountNumber: "1122334455",
    bank: "Smart Bottle Waste Bank",
  },
];
