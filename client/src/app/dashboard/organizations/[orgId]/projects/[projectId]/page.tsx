"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  deleteProject,
  getProject,
  updateProject,
} from "@/features/projects/api/projects.api";
import {
  createProjectSchema,
  type CreateProjectFormData,
} from "@/features/projects/schemas/create-project.schema";
import { BoardSection } from "@/features/board/components/board-section";

import { useOrganizationStore } from "@/store/organization.store";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProjectDetailPage() {
  const params = useParams<{ orgId: string; projectId: string }>();
  const orgId = params.orgId;
  const projectId = params.projectId;

  const router = useRouter();

  const currentOrganization = useOrganizationStore(
    (state) => state.currentOrganization
  );

  const queryClient = useQueryClient();

  const [editing, setEditing] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ["project", orgId, projectId],
    queryFn: () => getProject(orgId, projectId),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    values: {
      name: project?.name ?? "",
      description: project?.description ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateProjectFormData) =>
      updateProject(orgId, projectId, data),
    onSuccess: () => {
      toast.success("Project updated successfully.");
      setEditing(false);

      queryClient.invalidateQueries({
        queryKey: ["project", orgId, projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects", orgId],
      });
    },
    onError: () => {
      toast.error("Unable to update project.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProject(orgId, projectId),
    onSuccess: () => {
      toast.success("Project deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["projects", orgId],
      });

      router.push(`/dashboard/organizations/${orgId}/projects`);
    },
    onError: () => {
      toast.error("Unable to delete project.");
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${project?.name}"? This will permanently remove the project and all of its boards and tasks.`
      )
    ) {
      deleteMutation.mutate();
    }
  };

  const isOwner = currentOrganization?.role === "OWNER";

  if (isLoading || !project) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-muted-foreground size-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {project.name}
        </h1>

        <p className="text-muted-foreground mt-1 text-sm">
          {currentOrganization?.name}
        </p>
      </div>

      <section>
        <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wide">
          Kanban board
        </h2>

        <BoardSection orgId={orgId} projectId={projectId} />
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Project</CardTitle>

          {!editing && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(true)}
            >
              <Pencil className="mr-2 size-3.5" />
              Edit
            </Button>
          )}
        </CardHeader>

        <CardContent>
          {editing ? (
            <form
              onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Project name</Label>

                <Input
                  id="name"
                  {...register("name")}
                  disabled={updateMutation.isPending}
                />

                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>

                <textarea
                  id="description"
                  rows={4}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 dark:bg-input/30 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-2 text-base outline-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...register("description")}
                  disabled={updateMutation.isPending}
                />

                {errors.description && (
                  <p className="text-destructive text-sm">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Save
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between gap-8">
                <dt className="text-muted-foreground shrink-0">Name</dt>

                <dd className="font-medium">{project.name}</dd>
              </div>

              <div className="flex justify-between gap-8">
                <dt className="text-muted-foreground shrink-0">Description</dt>

                <dd className="font-medium">
                  {project.description || "No description"}
                </dd>
              </div>

              <div className="flex justify-between gap-8">
                <dt className="text-muted-foreground shrink-0">Created</dt>

                <dd className="font-medium">
                  {new Date(project.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      {isOwner && (
        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle className="text-destructive text-base">
              Danger zone
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground mb-4 text-sm">
              Deleting this project removes its board and all tasks. This action
              cannot be undone.
            </p>

            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 size-4" />
              )}
              Delete project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
