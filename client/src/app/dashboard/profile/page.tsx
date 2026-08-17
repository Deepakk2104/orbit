"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";
import { useAuthStore } from "@/store/auth.store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <ProtectedRoute>
      <main className="bg-background min-h-screen">
        <div className="mx-auto min-h-screen max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between border-b pb-6">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Orbit</p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                Profile
              </h1>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>

              <p className="text-muted-foreground text-xs">{user?.email}</p>
            </div>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <section className="space-y-4">
              <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                Personal information
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Update profile</CardTitle>
                </CardHeader>

                <CardContent>
                  <ProfileForm />
                </CardContent>
              </Card>
            </section>

            <section className="space-y-4">
              <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
                Security
              </h2>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Change password</CardTitle>
                </CardHeader>

                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </section>
          </div>

          <div className="mt-8">
            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
            >
              <ArrowLeft className="size-4" />
              Back to dashboard
            </Link>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
