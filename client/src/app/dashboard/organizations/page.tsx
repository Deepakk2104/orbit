"use client";

import { OrganizationList } from "@/features/organizations/components/organization-list";
import { CreateOrganizationForm } from "@/features/organizations/components/create-organization-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrganizationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Organizations
        </h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Manage your workspaces and invite teammates.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
            Your organizations
          </h2>

          <OrganizationList />
        </section>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create organization</CardTitle>
            </CardHeader>

            <CardContent>
              <CreateOrganizationForm />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
