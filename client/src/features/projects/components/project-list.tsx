"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Folder, Loader2 } from "lucide-react";

import { listProjects } from "../api/projects.api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ProjectList({ orgId }: { orgId: string }) {
  const router = useRouter();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects", orgId],
    queryFn: () => listProjects(orgId),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-12 text-center">
        <Folder className="size-8 text-muted-foreground" />

        <div>
          <p className="font-medium">No projects yet</p>
          <p className="text-sm text-muted-foreground">
            Create your first project to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">
              {project.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-row items-center justify-between">
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {project.description || "No description"}
            </p>

            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                router.push(
                  `/dashboard/organizations/${orgId}/projects/${project.id}`
                )
              }
            >
              Open

              <ChevronRight className="ml-1 size-3.5" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}