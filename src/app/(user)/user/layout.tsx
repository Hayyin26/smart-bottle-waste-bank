import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Dashboard - IoT Bank Sampah",
  description: "Personal dashboard for IoT Bank Sampah users",
};

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Empty layout - let the page handle everything
  return <>{children}</>;
}
