"use client";

import Link from "next/link";
import {
  Send,
  Download,
  Upload,
  CreditCard,
  Plus,
  BarChart3,
} from "lucide-react";

const quickActions = [
  {
    label: "Transfer",
    icon: Send,
    href: "/transfer",
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Withdraw",
    icon: Download,
    href: "/withdraw",
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Deposit",
    icon: Upload,
    href: "/deposit",
    color: "from-green-500 to-green-600",
  },
  {
    label: "Order Card",
    icon: CreditCard,
    href: "/card",
    color: "from-orange-500 to-orange-600",
  },
  {
    label: "Add Account",
    icon: Plus,
    href: "/add-account",
    color: "from-pink-500 to-pink-600",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.label} href={action.href}>
            <div className="group cursor-pointer">
              <div
                className={`mb-3 flex h-16 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} text-white shadow-md transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-center text-sm font-medium text-foreground">
                {action.label}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
