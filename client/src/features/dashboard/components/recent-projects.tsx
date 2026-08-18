"use client";

import Link from "next/link";
import { FolderKanban, ChevronRight } from "lucide-react";

import type { RecentProject } from "../types";
import { formatDate } from "@/lib/format";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface RecentProjectsProps {
  orgId: string;
  projects: RecentProject[];
}

export function RecentProjects({ orgId, projects }: RecentProjectsProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
            <FolderKanban className="size-6" />
          </div>

          <div>
            <p className="font-medium">No projects yet</p>

            <p className="text-muted-foreground text-sm">
              Create your first project to get started.
            </p>
          </div>

          <Link
            href={`/dashboard/organizations/${orgId}/projects`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            New project
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent projects</CardTitle>
      </CardHeader>

      <CardContent className="space-y-1">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/organizations/${orgId}/projects/${project.id}`}
            className="hover:bg-muted/50 group flex items-center justify-between gap-4 rounded-md px-2 py-2.5 transition-colors"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
                <FolderKanban className="size-4" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{project.name}</p>

                <p className="text-muted-foreground text-xs">
                  {project.taskCount} tasks · {formatDate(project.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {project.taskCount > 0 && (
                <div className="hidden w-24 sm:block">
                  <div className="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                    <div
                      className="bg-primary h-full rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <span className="text-muted-foreground text-xs font-medium tabular-nums">
                {project.progress}%
              </span>

              <ChevronRight className="text-muted-foreground group-hover:text-foreground size-4 transition-colors" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
