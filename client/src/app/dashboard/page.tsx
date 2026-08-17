"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, LogOut } from "lucide-react";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { logout } from "@/features/auth/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { useOrganizationStore } from "@/store/organization.store";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
      <main className="bg-background min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between border-b pb-6">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Orbit</p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user?.name}</p>

                <p className="text-muted-foreground text-xs">{user?.email}</p>
              </div>

              <Avatar className="size-9">
                {user?.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}

                <AvatarFallback>
                  {user?.name
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-muted-foreground hover:border-foreground/20 hover:text-foreground flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition-colors disabled:opacity-60"
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Organizations
            </Link>

            <Link
              href="/dashboard/profile"
              className="text-muted-foreground hover:border-foreground/20 hover:text-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              Profile
            </Link>
          </nav>

          <section className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Welcome to Orbit 👋</h2>

              <p className="text-muted-foreground mt-2 text-sm">
                Your workspace is ready.
              </p>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
