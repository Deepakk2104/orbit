"use client";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

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

            <div className="text-right">
              <p className="text-sm font-medium">
                {user?.name}
              </p>

              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </header>

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