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
  // No wrapper needed - pages handle their own layout
  // This layout exists only to provide separate metadata for user pages
  return <>{children}</>;
}
