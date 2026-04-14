export type Transaction = {
  id: string;
  userName: string;
  email: string;
  type: "Deposit" | "Withdrawal";
  amount: number;
  bottles: number;
  date: string;
  time: string;
  status: "Completed" | "Pending" | "Failed";
};

export const transactions: Transaction[] = [
  {
    id: "TXN-001",
    userName: "Ahmad Suryanto",
    email: "ahmad@example.com",
    type: "Deposit",
    amount: 150000,
    bottles: 15,
    date: "2024-01-15",
    time: "10:30 AM",
    status: "Completed",
  },
  {
    id: "TXN-002",
    userName: "Siti Nurhaliza",
    email: "siti@example.com",
    type: "Withdrawal",
    amount: 250000,
    bottles: 25,
    date: "2024-01-14",
    time: "02:15 PM",
    status: "Completed",
  },
  {
    id: "TXN-003",
    userName: "Budi Santoso",
    email: "budi@example.com",
    type: "Deposit",
    amount: 100000,
    bottles: 10,
    date: "2024-01-14",
    time: "11:45 AM",
    status: "Pending",
  },
  {
    id: "TXN-004",
    userName: "Rina Wijaya",
    email: "rina@example.com",
    type: "Deposit",
    amount: 180000,
    bottles: 18,
    date: "2024-01-13",
    time: "09:20 AM",
    status: "Completed",
  },
  {
    id: "TXN-005",
    userName: "Hendra Kusuma",
    email: "hendra@example.com",
    type: "Withdrawal",
    amount: 320000,
    bottles: 32,
    date: "2024-01-13",
    time: "03:50 PM",
    status: "Completed",
  },
  {
    id: "TXN-006",
    userName: "Dewi Lestari",
    email: "dewi@example.com",
    type: "Deposit",
    amount: 200000,
    bottles: 20,
    date: "2024-01-12",
    time: "01:30 PM",
    status: "Failed",
  },
  {
    id: "TXN-007",
    userName: "Riko Pratama",
    email: "riko@example.com",
    type: "Withdrawal",
    amount: 280000,
    bottles: 28,
    date: "2024-01-12",
    time: "04:15 PM",
    status: "Completed",
  },
  {
    id: "TXN-008",
    userName: "Maya Handoko",
    email: "maya@example.com",
    type: "Deposit",
    amount: 120000,
    bottles: 12,
    date: "2024-01-11",
    time: "10:00 AM",
    status: "Completed",
  },
];

export const transactionMetrics = [
  {
    title: "Total Transactions",
    value: "2,458",
    change: 0.12,
  },
  {
    title: "Pending Transactions",
    value: "24",
    change: -0.08,
  },
  {
    title: "Total Revenue",
    value: "Rp 98.5M",
    change: 0.18,
  },
  {
    title: "Active Users",
    value: "1,245",
    change: 0.15,
  },
];
