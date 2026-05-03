import type { Metadata } from "next";
import { Gabarito } from "next/font/google";
import { SideNav } from "@/components/nav";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import "@/style/globals.css";
import { Providers } from "./providers";

const gabarito = Gabarito({ subsets: ["latin"], variable: "--font-gabarito" });

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id-ID" suppressHydrationWarning>
      <body className={cn("bg-background font-sans", gabarito.variable)}>
        <Providers>
          <div className="flex min-h-[100dvh]" data-app-frame>
            <div data-side-nav-shell>
              <SideNav />
            </div>
            <div className="flex-grow overflow-auto" data-app-content>
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
