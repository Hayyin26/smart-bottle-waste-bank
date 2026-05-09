import { SideNav } from "@/components/nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh]">
      <SideNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
