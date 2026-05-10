"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

/**
 * AuthGuard Component - Melindungi route yang memerlukan login
 * Redirect ke login jika user tidak authenticated
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Routes yang butuh login
  const protectedRoutes = ["/dashboard", "/profile", "/history", "/laporan", "/nasabah", "/transaksi"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Routes yang hanya bisa diakses kalau belum login
  const publicAuthRoutes = ["/login", "/register"];
  const isPublicAuthRoute = publicAuthRoutes.includes(pathname);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        // Jika route protected dan tidak ada session
        if (isProtectedRoute && !session) {
          router.push("/login");
          return;
        }

        // Jika route public auth dan sudah ada session
        if (isPublicAuthRoute && session) {
          router.push("/dashboard");
          return;
        }

        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Auth check error:", error);
        if (isProtectedRoute) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Jika route protected dan session hilang
      if (isProtectedRoute && !session) {
        router.push("/login");
        return;
      }

      // Jika route public auth dan ada session
      if (isPublicAuthRoute && session) {
        router.push("/dashboard");
        return;
      }

      setIsAuthenticated(!!session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [pathname, isProtectedRoute, isPublicAuthRoute, router]);

  // Show loading saat checking auth (jangan render apapun)
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-slate-600">Memeriksa otorisasi...</p>
        </div>
      </div>
    );
  }

  // Jika protected route dan tidak authenticated, tampilkan loading
  if (isProtectedRoute && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="text-slate-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Render children hanya jika auth check selesai dan authenticated
  return children;
}
