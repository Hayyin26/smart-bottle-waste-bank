"use client";

import { VChart } from "@visactor/react-vchart";
import type { ILineChartSpec } from "@visactor/vchart";
import { TrendingUp } from "lucide-react";
import ChartTitle from "@/components/chart-blocks/components/chart-title";
import type { DailyActivityData } from "@/services/transactions.service";

const generateSpec = (data: DailyActivityData[]): ILineChartSpec => {
  return {
    type: "line",
    data: [
      {
        id: "weeklyActivity",
        values: data.map((d) => ({
          date: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          count: d.count,
        })),
      },
    ],
    xField: "date",
    yField: "count",
    seriesField: "date",
    line: {
      style: {
        lineWidth: 2.5,
      },
    },
    point: {
      style: {
        size: 6,
        fillOpacity: 1,
      },
    },
    color: ["#3b82f6"],
    tooltip: {
      trigger: ["hover"],
    },
    axes: [
      {
        orient: "left",
        type: "linear",
        min: 0,
        label: {
          visible: true,
        },
        title: {
          visible: false,
        },
      },
      {
        orient: "bottom",
        type: "band",
        label: {
          visible: true,
        },
        title: {
          visible: false,
        },
      },
    ],
    markArea: undefined,
  };
};

export default function WeeklyActivityChart({ data }: { data: DailyActivityData[] }) {
  const spec = generateSpec(data);

  return (
    <div className="flex h-80 flex-col rounded-lg border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900">
      <div className="mb-4">
        <ChartTitle title="Weekly Activity" icon={TrendingUp} />
        <p className="mt-2 text-sm text-muted-foreground">
          Total scans in the last 7 days
        </p>
      </div>
      <div className="flex-1">
        <VChart spec={spec} className="w-full h-full" />
      </div>
    </div>
  );
}
