"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Calendar, GripVertical, User } from "lucide-react";

import { cn } from "@/lib/utils";
import type { BoardTask } from "../types";

const priorityStyles: Record<BoardTask["priority"], string> = {
  LOW: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  MEDIUM: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  HIGH: "bg-destructive/10 text-destructive",
};

export function TaskCard({
  task,
  onOpen,
  overlay = false,
}: {
  task: BoardTask;
  onOpen?: (task: BoardTask) => void;
  overlay?: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: overlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={overlay ? undefined : setNodeRef}
      style={overlay ? undefined : style}
      {...(overlay ? {} : attributes)}
      className={cn(
        "bg-card shadow-xs group rounded-lg border p-3",
        isDragging && "opacity-40",
        overlay && "rotate-2 shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          className="min-w-0 cursor-pointer text-left text-sm font-medium leading-snug hover:underline"
          onClick={() => onOpen?.(task)}
        >
          {task.title}
        </button>

        {!overlay && (
          <button
            type="button"
            className="text-muted-foreground hover:bg-muted cursor-grab touch-none rounded p-0.5 opacity-0 transition-opacity active:cursor-grabbing group-hover:opacity-100"
            aria-label="Drag task"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="size-4" />
          </button>
        )}
      </div>

      <div className="text-muted-foreground mt-2.5 flex items-center gap-2 text-xs">
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-medium uppercase",
            priorityStyles[task.priority]
          )}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3" />

            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}

        {task.assignee && (
          <span className="ml-auto inline-flex items-center gap-1">
            <User className="size-3" />

            <span className="max-w-20 truncate">
              {task.assignee.name.split(" ")[0]}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}
