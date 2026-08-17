"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: CreateProjectFormData) => {
    try {
      await createProject(orgId, data);

      toast.success("Project created successfully.");
      reset();

      onCreated?.();
    } catch (error) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error
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
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Project name</Label>

        <Input
          id="name"
          placeholder="Website Redesign"
          {...register("name")}
          disabled={isSubmitting}
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>

        <textarea
          id="description"
          placeholder="What is this project about?"
          rows={3}
          className="w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 md:text-sm"
          {...register("description")}
          disabled={isSubmitting}
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && (
          <Loader2 className="mr-2 size-4 animate-spin" />
        )}

        {isSubmitting ? "Creating..." : "Create project"}
      </Button>
    </form>
  );
}