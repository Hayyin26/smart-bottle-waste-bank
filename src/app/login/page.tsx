import type { Metadata } from "next";
import { AuthView } from "@/components/auth/auth-view";

export const metadata: Metadata = {
  title: "Login | Smart Bottle Waste Bank",
};

export default function LoginPage() {
  return <AuthView mode="login" />;
}
