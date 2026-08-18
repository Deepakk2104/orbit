"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, RefreshCw } from "lucide-react";

import { getDashboard } from "../api/dashboard.api";
import { useOrganizationStore } from "@/store/organization.store";
import { useAuthStore } from "@/store/auth.store";
import { StatsGrid } from "./stats-grid";
import { RecentProjects } from "./recent-projects";
import { ActivityFeed } from "./activity-feed";

import { Button, buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

const getGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="bg-muted h-8 w-64 animate-pulse rounded-md" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-muted h-24 animate-pulse rounded-xl" />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-muted h-72 animate-pulse rounded-xl" />

        <div className="bg-muted h-72 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

export function DashboardContent() {
  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );
  const user = useAuthStore((state) => state.user);

  const orgId = currentOrganization?.id;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard", orgId],
    queryFn: () => getDashboard(orgId!),
    enabled: Boolean(orgId),
  });

  // Invalidate and refetch dashboard when organization changes
  const queryClient = useQueryClient();
  useEffect(() => {
    if (orgId) {
      queryClient.invalidateQueries({ queryKey: ["dashboard", orgId] });
    }
  }, [orgId, queryClient]);

  if (!orgId) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
            <Building2 className="size-6" />
          </div>

          <h2 className="text-lg font-semibold">No organization selected</h2>

          <p className="text-muted-foreground max-w-sm text-sm">
            Select or create an organization to see your workspace overview.
          </p>

          <Link
            href="/dashboard/organizations"
            className={cn(buttonVariants({ size: "sm" }))}
          >
            Go to organizations
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {getGreeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>

          <p className="text-muted-foreground mt-1 text-sm">
            Here&apos;s what&apos;s happening across{" "}
            <span className="text-foreground font-medium">
              {currentOrganization.name}
            </span>
            .
          </p>
        </div>
      </div>

      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <section className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-lg font-semibold">Something went wrong</p>

          <p className="text-muted-foreground max-w-sm text-sm">
            We couldn&apos;t load your dashboard. Please try again.
          </p>

          <Button size="sm" onClick={() => refetch()}>
            <RefreshCw className="mr-2 size-3.5" />
            Retry
          </Button>
        </section>
      ) : data ? (
        <>
          <StatsGrid stats={data.stats} />

          <div className="grid gap-6 lg:grid-cols-2">
            <RecentProjects orgId={orgId} projects={data.recentProjects} />

            <ActivityFeed activities={data.activity} />
          </div>
        </>
      ) : null}
    </div>
  );
}
