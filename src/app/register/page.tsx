import type { Metadata } from "next";
import { AuthView } from "@/components/auth/auth-view";

export const metadata: Metadata = {
  title: "Register | Smart Bottle Waste Bank",
};

export default function RegisterPage() {
  return <AuthView mode="register" />;
}
