"use client";

import { ProfileForm } from "@/features/profile/components/profile-form";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Profile
        </h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Manage your personal information and security.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
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
    </div>
  );
}
