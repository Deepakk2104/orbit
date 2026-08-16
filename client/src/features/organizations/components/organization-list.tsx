"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Building2, ChevronRight, Loader2 } from "lucide-react";

import { listOrganizations } from "../api/organizations.api";

import { useOrganizationStore } from "@/store/organization.store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrganizationList() {
  const router = useRouter();

  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );
  const setCurrentOrganization = useOrganizationStore(
    (state) => state.setCurrentOrganization
  );

  const { data: organizations, isLoading } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => listOrganizations(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!organizations || organizations.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
        <Building2 className="size-8 text-muted-foreground" />

        <div>
          <p className="font-medium">No organizations yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first organization to get started.
          </p>
        </div>
      </div>
    );
  }

  const openOrganization = (organizationId: string) => {
    const organization = organizations.find(
      (item) => item.id === organizationId
    );

    if (organization) {
      setCurrentOrganization(organization);
    }

    router.push(`/dashboard/organizations/${organizationId}`);
  };

  return (
    <div className="space-y-3">
      {organizations.map((organization) => {
        const isActive = currentOrganization?.id === organization.id;

        return (
          <Card
            key={organization.id}
            className={
              isActive ? "border-primary bg-primary/5" : undefined
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">
                {organization.name}
              </CardTitle>

              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium uppercase text-muted-foreground">
                {organization.role}
              </span>
            </CardHeader>

            <CardContent className="flex flex-row items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {organization.slug}
              </p>

              <Button
                size="sm"
                variant={isActive ? "secondary" : "outline"}
                onClick={() => openOrganization(organization.id)}
              >
                {isActive ? "Current" : "Open"}

                <ChevronRight className="ml-1 size-3.5" />
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}