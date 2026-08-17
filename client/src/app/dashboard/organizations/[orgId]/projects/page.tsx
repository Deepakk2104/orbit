"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ProjectList } from "@/features/projects/components/project-list";
import { CreateProjectForm } from "@/features/projects/components/create-project-form";
import { ProtectedRoute } from "@/features/auth/components/protected-route";

import { useOrganizationStore } from "@/store/organization.store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;

  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <div className="mx-auto min-h-screen max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b pb-6">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/organizations"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Back to organizations"
              >
                <ArrowLeft className="size-5" />
              </Link>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Orbit
                </p>

                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                  {currentOrganization?.name ?? "Projects"}
                </h1>
              </div>
            </div>
          </header>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <section className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Projects
              </h2>

              <ProjectList orgId={orgId} />
            </section>

            <aside>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Create project
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CreateProjectForm orgId={orgId} />
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}