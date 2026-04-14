"use client";

import { LineChart } from "lucide-react";
import ChartTitle from "../../components/chart-title";

const transactionTrendData = [
  { date: "Jan 8", deposits: 120, withdrawals: 95, total: 215 },
  { date: "Jan 9", deposits: 150, withdrawals: 130, total: 280 },
  { date: "Jan 10", deposits: 180, withdrawals: 110, total: 290 },
  { date: "Jan 11", deposits: 200, withdrawals: 140, total: 340 },
  { date: "Jan 12", deposits: 160, withdrawals: 175, total: 335 },
  { date: "Jan 13", deposits: 220, withdrawals: 160, total: 380 },
  { date: "Jan 14", deposits: 240, withdrawals: 190, total: 430 },
  { date: "Jan 15", deposits: 210, withdrawals: 165, total: 375 },
];

export default function TransactionTrend() {
  const maxValue = Math.max(...transactionTrendData.map((d) => d.total));

  return (
    <section className="flex h-full flex-col gap-4">
      <ChartTitle title="Transaction Volume Trend" icon={LineChart} />
      <div className="flex-1 space-y-4">
        {/* Simple Bar Chart */}
        <div className="space-y-3">
          {transactionTrendData.map((data) => (
            <div key={data.date} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{data.date}</span>
                <span className="text-xs text-muted-foreground">
                  {data.total} transactions
                </span>
              </div>
              <div className="flex h-6 overflow-hidden rounded-full bg-muted">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 transition-all"
                  style={{
                    width: `${(data.deposits / maxValue) * 100}%`,
                  }}
                  title={`Deposits: ${data.deposits}`}
                />
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{
                    width: `${(data.withdrawals / maxValue) * 100}%`,
                  }}
                  title={`Withdrawals: ${data.withdrawals}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 flex gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
            <span className="text-sm text-muted-foreground">Deposits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
            <span className="text-sm text-muted-foreground">Withdrawals</span>
          </div>
        </div>
      </div>
    </section>
  );
}
