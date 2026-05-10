"use client";

import { SideNav } from "@/components/nav";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-[100dvh]">
        <SideNav />
        <main className="flex-1">{children}</main>
      </div>
    </AuthGuard>
  );
}
