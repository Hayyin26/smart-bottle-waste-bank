import { CreditCard, TrendingDown, TrendingUp } from "lucide-react";

interface TransactionRowProps {
  transaction: {
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
}

const statusStyles = {
  Completed: "bg-green-100 text-green-800",
  Pending: "bg-yellow-100 text-yellow-800",
  Failed: "bg-red-100 text-red-800",
};

const typeStyles = {
  Deposit: "text-green-600",
  Withdrawal: "text-blue-600",
};

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const TypeIcon =
    transaction.type === "Deposit" ? TrendingUp : TrendingDown;

  return (
    <tr className="border-b border-border transition-colors hover:bg-muted/40">
      <td className="px-4 py-3 text-sm">{transaction.id}</td>
      <td className="px-4 py-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium">{transaction.userName}</span>
          <span className="text-xs text-muted-foreground">{transaction.email}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className={`flex items-center gap-1 text-sm font-medium ${typeStyles[transaction.type]}`}>
          <TypeIcon className="h-4 w-4" />
          {transaction.type}
        </div>
      </td>
      <td className="px-4 py-3 text-right text-sm font-medium">
        {formatCurrency(transaction.amount)}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{transaction.bottles}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">
        <div className="flex flex-col">
          <span>{transaction.date}</span>
          <span className="text-xs">{transaction.time}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusStyles[transaction.status]}`}
        >
          {transaction.status}
        </span>
      </td>
    </tr>
  );
}
