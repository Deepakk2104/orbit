"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, ListTodo, SearchX } from "lucide-react";

import { listProjects } from "@/features/projects/api/projects.api";
import { getBoard } from "@/features/board/api/boards.api";
import { useOrganizationStore } from "@/store/organization.store";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

interface TaskRow {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: string | null;
  columnName: string;
  projectId: string;
  projectName: string;
  assignee: { id: string; name: string; avatar: string | null } | null;
}

const priorityStyles: Record<TaskRow["priority"], string> = {
  LOW: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  HIGH: "bg-destructive/10 text-destructive",
};

function TasksPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );

  const orgId = currentOrganization?.id;

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", orgId],
    queryFn: () => listProjects(orgId!),
    enabled: Boolean(orgId),
  });

  const boardsQuery = useQuery({
    queryKey: ["tasks", "boards", orgId, projects?.map((p) => p.id)],
    queryFn: async () => {
      const results = await Promise.all(
        projects!.map(async (project) => {
          const board = await getBoard(orgId!, project.id);

          return { project, board };
        })
      );

      return results;
    },
    enabled: Boolean(orgId && projects && projects.length > 0),
  });

  const tasks = useMemo<TaskRow[]>(() => {
    if (!boardsQuery.data) return [];

    const rows: TaskRow[] = [];

    for (const { project, board } of boardsQuery.data) {
      for (const column of board.columns) {
        for (const task of column.tasks) {
          rows.push({
            id: task.id,
            title: task.title,
            priority: task.priority,
            dueDate: task.dueDate,
            columnName: column.name,
            projectId: project.id,
            projectName: project.name,
            assignee: task.assignee,
          });
        }
      }
    }

    return rows.sort(
      (a, b) =>
        new Date(a.dueDate ?? 0).getTime() - new Date(b.dueDate ?? 0).getTime()
    );
  }, [boardsQuery.data]);

  const filteredTasks = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    if (!trimmed) return tasks;

    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(trimmed) ||
        task.projectName.toLowerCase().includes(trimmed) ||
        task.columnName.toLowerCase().includes(trimmed) ||
        task.assignee?.name.toLowerCase().includes(trimmed)
    );
  }, [tasks, query]);

  if (!orgId) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
            <Building2 className="size-6" />
          </div>

          <h2 className="text-lg font-semibold">No organization selected</h2>

          <p className="text-muted-foreground max-w-sm text-sm">
            Select an organization to browse its tasks.
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

  if (
    projectsLoading ||
    (projects && projects.length > 0 && boardsQuery.isLoading)
  ) {
    return (
      <div className="space-y-6">
        <div className="bg-muted h-8 w-48 animate-pulse rounded-md" />

        <div className="bg-muted h-72 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (projects && projects.length === 0) {
    return (
      <section className="flex flex-col items-center gap-3 py-16 text-center">
        <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
          <ListTodo className="size-6" />
        </div>

        <h2 className="text-lg font-semibold">No projects yet</h2>

        <p className="text-muted-foreground max-w-sm text-sm">
          Create a project to start adding tasks.
        </p>

        <Link
          href={`/dashboard/organizations/${orgId}/projects`}
          className={cn(buttonVariants({ size: "sm" }))}
        >
          New project
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Tasks
          </h1>

          <p className="text-muted-foreground mt-1 text-sm">
            {filteredTasks.length} of {tasks.length} tasks
            {query.trim() ? ` matching "${query.trim()}"` : ""}
          </p>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <section className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
            <SearchX className="size-6" />
          </div>

          <h2 className="text-lg font-semibold">No tasks found</h2>

          <p className="text-muted-foreground max-w-sm text-sm">
            Try a different search or clear your filters.
          </p>
        </section>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All tasks</CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <ul className="divide-border divide-y">
              {filteredTasks.map((task) => (
                <li key={task.id}>
                  <Link
                    href={`/dashboard/organizations/${orgId}/projects/${task.projectId}`}
                    className="hover:bg-muted/50 flex items-center justify-between gap-4 px-4 py-3 transition-colors sm:px-5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        className={cn(
                          "size-2 shrink-0 rounded-full",
                          task.priority === "HIGH" && "bg-destructive",
                          task.priority === "MEDIUM" && "bg-amber-500",
                          task.priority === "LOW" && "bg-emerald-500"
                        )}
                        aria-hidden="true"
                      />

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {task.title}
                        </p>

                        <p className="text-muted-foreground truncate text-xs">
                          {task.projectName} · {task.columnName}
                          {task.assignee
                            ? ` · ${task.assignee.name.split(" ")[0]}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={cn(
                          "hidden rounded-full px-2 py-0.5 text-xs font-medium uppercase sm:inline",
                          priorityStyles[task.priority]
                        )}
                      >
                        {task.priority}
                      </span>

                      {task.dueDate && (
                        <span className="text-muted-foreground hidden text-xs tabular-nums md:inline">
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense>
      <TasksPageContent />
    </Suspense>
  );
}
