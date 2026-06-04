"use client";

import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { Users } from "lucide-react";
import ChartTitle from "@/components/chart-blocks/components/chart-title";
import type { Profile } from "@/services/profiles.service";

const generateSpec = (users: Profile[]): IBarChartSpec => {
  return {
    type: "bar",
    data: [
      {
        id: "topUsers",
        values: users.map((user) => ({
          name: user.full_name ?? "Unknown",
          points: user.total_points,
          label: user.full_name ?? "Unknown",
        })),
      },
    ],
    xField: "name",
    yField: "points",
    bar: {
      style: {
        cornerRadius: [4, 4, 0, 0],
      },
    },
    color: ["#8b5cf6"],
    legends: [
      {
        visible: false,
      },
    ],
    tooltip: {
      trigger: ["hover"],
    },
    axes: [
      {
        orient: "left",
        type: "linear",
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
          autoHide: true,
        },
        title: {
          visible: false,
        },
      },
    ],
  };
};

export default function TopUsersChart({ users }: { users: Profile[] }) {
  const spec = generateSpec(users);

  return (
    <div className="flex h-80 flex-col rounded-lg border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900">
      <div className="mb-4">
        <ChartTitle title="Top Users" icon={Users} />
        <p className="mt-2 text-sm text-muted-foreground">
          Top users based on accumulated points.
        </p>
      </div>
      <div className="flex-1">
        <VChart spec={spec} className="w-full h-full" />
      </div>
    </div>
  );
}
