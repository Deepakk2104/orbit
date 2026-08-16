"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { logout } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useOrganizationStore } from "@/store/organization.store";

export default function DashboardPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const clearOrganization = useOrganizationStore(
    (state) => state.clearOrganization
  );

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      // Even if the server call fails, clear the local session.
    }

    clearAuth();
    clearOrganization();

    router.replace("/login");
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between border-b pb-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Orbit
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {user?.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground disabled:opacity-60"
              >
                {isLoggingOut ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <LogOut className="size-3.5" />
                )}

                Logout
              </button>
            </div>
          </header>

          <nav className="mt-6 flex gap-2">
            <Link
              href="/dashboard/organizations"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Organizations
            </Link>
          </nav>

          <section className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">
                Welcome to Orbit 👋
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Your workspace is ready.
              </p>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}