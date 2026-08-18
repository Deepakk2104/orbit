"use client";

import { useParams } from "next/navigation";

import { ProjectList } from "@/features/projects/components/project-list";
import { CreateProjectForm } from "@/features/projects/components/create-project-form";

import { useOrganizationStore } from "@/store/organization.store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProjectsPage() {
  const params = useParams<{ orgId: string }>();
  const orgId = params.orgId;

  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {currentOrganization?.name ?? "Projects"}
        </h1>

        <p className="text-muted-foreground mt-1 text-sm">
          Manage your projects and boards.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          <h2 className="text-muted-foreground text-sm font-semibold uppercase tracking-wide">
            Projects
          </h2>

          <ProjectList orgId={orgId} />
        </section>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Create project</CardTitle>
            </CardHeader>

            <CardContent>
              <CreateProjectForm orgId={orgId} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
