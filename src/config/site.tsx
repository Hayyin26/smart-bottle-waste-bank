import { Gauge, type LucideIcon, Trash2, Users, BarChart3, Settings, History } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "IoT QR System - Bank Sampah",
  description: "Sistem Manajemen Bank Sampah dengan IoT QR Code",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: History,
    name: "History",
    href: "/history",
  },
  {
    icon: Users,
    name: "Users",
    href: "/nasabah",
  },
  {
    icon: Trash2,
    name: "Transaksi",
    href: "/transaksi",
  },
  {
    icon: BarChart3,
    name: "Laporan",
    href: "/laporan",
  },
];
