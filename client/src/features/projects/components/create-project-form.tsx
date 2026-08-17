"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createProject } from "../api/projects.api";
import {
  createProjectSchema,
  type CreateProjectFormData,
} from "../schemas/create-project.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateProjectForm({
  orgId,
  onCreated,
}: {
  orgId: string;
  onCreated?: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateProjectFormData) => createProject(orgId, data),
    onSuccess: () => {
      toast.success("Project created successfully.");
      reset();
      onCreated?.();

      queryClient.invalidateQueries({ queryKey: ["projects", orgId] });
    },
    onError: (error) => {
      const message =
        typeof error === "object" && error !== null && "response" in error
          ? (
              error as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      toast.error(message ?? "Unable to create project.");
    },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => mutation.mutate(data))}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Project name</Label>

        <Input
          id="name"
          placeholder="Website Redesign"
          {...register("name")}
          disabled={mutation.isPending}
        />

        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <textarea
          id="description"
          placeholder="What is this project about?"
          rows={3}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:bg-input/50 dark:bg-input/30 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-2 text-base outline-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
          {...register("description")}
          disabled={mutation.isPending}
        />

        {errors.description && (
          <p className="text-destructive text-sm">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="mr-2 size-4 animate-spin" />}

        {mutation.isPending ? "Creating..." : "Create project"}
      </Button>
    </form>
  );
}
