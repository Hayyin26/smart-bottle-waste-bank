import { Gauge, type LucideIcon, Trash2, Users, BarChart3, Settings } from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
};

export const siteConfig = {
  title: "Smart Bottle Waste Bank",
  description: "Sistem Manajemen Bank Sampah Digital",
};

export const navigations: Navigation[] = [
  {
    icon: Gauge,
    name: "Dashboard",
    href: "/",
  },
  {
    icon: Trash2,
    name: "Transaksi",
    href: "/transaksi",
  },
  {
    icon: Users,
    name: "User",
    href: "/nasabah",
  },
  {
    icon: BarChart3,
    name: "Laporan",
    href: "/laporan",
  },
];
