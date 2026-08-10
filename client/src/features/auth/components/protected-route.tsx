"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname)}`
      );
    }
  }, [isAuthenticated, pathname, router]);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />

          <p className="text-sm text-muted-foreground">
            Checking your session...
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}