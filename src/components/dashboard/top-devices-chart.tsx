"use client";

import { VChart } from "@visactor/react-vchart";
import type { IBarChartSpec } from "@visactor/vchart";
import { Wifi } from "lucide-react";
import ChartTitle from "@/components/chart-blocks/components/chart-title";
import type { DeviceActivityData } from "@/services/transactions.service";

const generateSpec = (data: DeviceActivityData[]): IBarChartSpec => {
  return {
    type: "bar",
    data: [
      {
        id: "topDevices",
        values: data.map((d) => ({
          location: d.location.length > 20 ? d.location.substring(0, 20) + "..." : d.location,
          count: d.count,
          fullLocation: d.location,
        })),
      },
    ],
    xField: "location",
    yField: "count",
    bar: {
      style: {
        cornerRadius: [4, 4, 0, 0],
      },
    },
    color: ["#10b981"],
    tooltip: {
      trigger: ["hover"],
      content: [
        {
          key: "location",
          value: "{fullLocation}",
        },
        {
          key: "Scans",
          value: "{count}",
        },
      ],
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

export default function TopDevicesChart({ data }: { data: DeviceActivityData[] }) {
  const spec = generateSpec(data);

  return (
    <div className="flex h-80 flex-col rounded-lg border border-border bg-white p-6 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-900">
      <div className="mb-4">
        <ChartTitle title="Top Active Devices" icon={Wifi} />
        <p className="mt-2 text-sm text-muted-foreground">
          Devices with most scans
        </p>
      </div>
      <div className="flex-1">
        <VChart spec={spec} className="w-full h-full" />
      </div>
    </div>
  );
}
