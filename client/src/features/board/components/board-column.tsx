"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { deleteColumn, updateColumn } from "../api/columns.api";
import type { BoardColumn, BoardTask } from "../types";
import { boardQueryKey, patchColumn, removeColumn } from "../lib/board-cache";
import { TaskCard } from "./task-card";
import { AddTaskForm } from "./add-task-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BoardColumnView({
  orgId,
  projectId,
  column,
  onOpenTask,
}: {
  orgId: string;
  projectId: string;
  column: BoardColumn;
  onOpenTask: (task: BoardTask) => void;
}) {
  const queryClient = useQueryClient();

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(column.name);

  const renameMutation = useMutation({
    mutationFn: () => updateColumn(orgId, projectId, column.id, { name }),
    onSuccess: (updated) => {
      setEditing(false);
      toast.success("Column updated successfully.");

      patchColumn(
        queryClient,
        boardQueryKey(orgId, projectId),
        column.id,
        (c) => ({
          ...c,
          name: updated.name,
        })
      );
    },
    onError: () => {
      toast.error("Unable to update column.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteColumn(orgId, projectId, column.id),
    onSuccess: () => {
      toast.success("Column deleted successfully.");

      removeColumn(queryClient, boardQueryKey(orgId, projectId), column.id);
    },
    onError: () => {
      toast.error("Unable to delete column.");
    },
  });

  const handleDelete = () => {
    if (
      window.confirm(
        `Delete "${column.name}"? All tasks in this column will be deleted.`
      )
    ) {
      deleteMutation.mutate();
    }
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-muted/30 flex w-72 shrink-0 flex-col rounded-xl border",
        isOver && "border-primary"
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        {editing ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();

              if (name.trim()) {
                renameMutation.mutate();
              }
            }}
            className="flex flex-1 items-center gap-1.5"
          >
            <Input
              autoFocus
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={renameMutation.isPending}
              className="h-7"
            />

            <Button
              type="submit"
              size="icon-sm"
              variant="ghost"
              disabled={renameMutation.isPending || !name.trim()}
              aria-label="Save column name"
            >
              {renameMutation.isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
            </Button>

            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setName(column.name);
              }}
              aria-label="Cancel renaming column"
            >
              <X className="size-3.5" />
            </Button>
          </form>
        ) : (
          <>
            <h3 className="min-w-0 flex-1 truncate text-sm font-semibold">
              {column.name}
            </h3>

            <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
              {column.tasks.length}
            </span>

            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                setName(column.name);
                setEditing(true);
              }}
              aria-label="Rename column"
            >
              <Pencil className="size-3.5" />
            </Button>

            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              aria-label="Delete column"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </>
        )}
      </div>

      <SortableContext
        items={column.tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2 p-3">
          {column.tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpenTask} />
          ))}

          <AddTaskForm orgId={orgId} projectId={projectId} column={column} />
        </div>
      </SortableContext>
    </div>
  );
}
