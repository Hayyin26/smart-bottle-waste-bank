import { Gauge, type LucideIcon, Trash2, Users, BarChart3, History, QrCode, Database } from "lucide-react";

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

// Base navigation items
const baseNavigations: Navigation[] = [
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
    icon: QrCode,
    name: "Device QR",
    href: "/device-qr",
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

// Hadoop navigation (only show if Hadoop URL is configured)
const hadoopNavigation: Navigation = {
  icon: Database,
  name: "Hadoop",
  href: "/hadoop",
};

// Conditionally include Hadoop menu
// Only show in development OR if NEXT_PUBLIC_HADOOP_URL is set
export const navigations: Navigation[] = [
  ...baseNavigations,
  // Show Hadoop if:
  // 1. Running in development mode (localhost), OR
  // 2. NEXT_PUBLIC_HADOOP_URL is explicitly set in production
  ...(process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_HADOOP_URL
    ? [hadoopNavigation]
    : []),
];
