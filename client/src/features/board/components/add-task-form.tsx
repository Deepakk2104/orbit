"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";

import { createTask } from "@/features/tasks/api/tasks.api";
import type { BoardColumn } from "../types";
import { boardQueryKey, appendTask } from "../lib/board-cache";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddTaskForm({
  orgId,
  projectId,
  column,
}: {
  orgId: string;
  projectId: string;
  column: BoardColumn;
}) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      createTask(orgId, projectId, column.id, {
        title,
        priority: "MEDIUM",
      }),
    onSuccess: (task) => {
      setTitle("");
      setOpen(false);

      toast.success("Task created successfully.");

      appendTask(queryClient, boardQueryKey(orgId, projectId), task);
    },
    onError: () => {
      toast.error("Unable to create task.");
    },
  });

  if (!open) {
    return (
      <Button
        size="sm"
        variant="ghost"
        className="text-muted-foreground w-full justify-start"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Add task
      </Button>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (title.trim()) {
          mutation.mutate();
        }
      }}
      className="space-y-2"
    >
      <Input
        autoFocus
        placeholder="Task title..."
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={mutation.isPending}
      />

      <div className="flex items-center gap-1.5">
        <Button
          type="submit"
          size="sm"
          disabled={mutation.isPending || !title.trim()}
        >
          {mutation.isPending && (
            <Loader2 className="mr-1 size-3.5 animate-spin" />
          )}
          Add
        </Button>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => {
            setOpen(false);
            setTitle("");
          }}
        >
          <X className="size-4" />
        </Button>
      </div>
    </form>
  );
}
