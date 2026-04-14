import { TrendingUp, Clock, AlertCircle } from "lucide-react";

interface AccountStatsProps {
  totalSpent: number;
  monthlySpending: number;
  averageTransaction: number;
}

export default function AccountStats({
  totalSpent,
  monthlySpending,
  averageTransaction,
}: AccountStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: TrendingUp,
      color: "text-red-600 bg-red-100",
    },
    {
      label: "This Month",
      value: formatCurrency(monthlySpending),
      icon: Clock,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Avg Transaction",
      value: formatCurrency(averageTransaction),
      icon: AlertCircle,
      color: "text-green-600 bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="rounded-lg border border-border bg-background p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
