"use client";

import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { OrganizationList } from "@/features/organizations/components/organization-list";
import { CreateOrganizationForm } from "@/features/organizations/components/create-organization-form";
import { useAuthStore } from "@/store/auth.store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrganizationsPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <ProtectedRoute>
        <main className="min-h-screen bg-background">
          <div className="mx-auto min-h-screen max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
            <header className="flex items-center justify-between border-b pb-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Orbit
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                  Organizations
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

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
              <section className="space-y-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Your organizations
                </h2>

                <OrganizationList />
              </section>

              <aside>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Create organization
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <CreateOrganizationForm />
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </main>
    </ProtectedRoute>
  );
}