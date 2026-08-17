"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { getBoard } from "../api/boards.api";
import { moveTask } from "@/features/tasks/api/tasks.api";
import type { Board, BoardColumn, BoardTask } from "../types";
import { BoardColumnView } from "./board-column";
import { AddColumnForm } from "./add-column-form";
import { TaskCard } from "./task-card";
import { TaskDialog } from "./task-dialog";

export function KanbanBoard({
  orgId,
  projectId,
}: {
  orgId: string;
  projectId: string;
}) {
  const queryClient = useQueryClient();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const { data: board, isLoading } = useQuery({
    queryKey: ["board", orgId, projectId],
    queryFn: () => getBoard(orgId, projectId),
  });

  const columns = useMemo(() => board?.columns ?? [], [board]);

  const [activeTask, setActiveTask] = useState<BoardTask | null>(null);
  const [openTask, setOpenTask] = useState<BoardTask | null>(null);

  const updateColumns = (
    updater: (columns: BoardColumn[]) => BoardColumn[]
  ) => {
    queryClient.setQueryData<Board>(
      ["board", orgId, projectId],
      (current) =>
        current
          ? { ...current, columns: updater(current.columns) }
          : current
    );
  };

  const columnMap = useMemo(() => {
    const map: Record<string, BoardColumn> = {};

    for (const column of columns) {
      map[column.id] = column;
    }

    return map;
  }, [columns]);

  const findColumn = (id: string) =>
    columnMap[id] ??
    columns.find((column) =>
      column.tasks.some((task) => task.id === id)
    );

  const handleDragStart = ({ active }: DragStartEvent) => {
    const activeId = String(active.id);

    setActiveTask(
      columns
        .flatMap((column) => column.tasks)
        .find((task) => task.id === activeId) ?? null
    );
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    updateColumns((current) => {
      const activeTasks = activeColumn.tasks;
      const overTasks = overColumn.tasks;

      const moved = activeTasks.find((task) => task.id === activeId);

      if (!moved) {
        return current;
      }

      const overIndex = overTasks.findIndex((task) => task.id === overId);
      const newIndex = overIndex >= 0 ? overIndex : overTasks.length;

      const next = current.map((column) =>
        column.id === activeColumn.id
          ? {
              ...column,
              tasks: column.tasks.filter((task) => task.id !== activeId),
            }
          : column
      );

      return next.map((column) =>
        column.id === overColumn.id
          ? {
              ...column,
              tasks: [
                ...column.tasks.slice(0, newIndex),
                moved,
                ...column.tasks.slice(newIndex),
              ],
            }
          : column
      );
    });
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveTask(null);

    if (!over) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);

    if (!activeColumn || !overColumn) {
      return;
    }

    if (activeColumn.id === overColumn.id) {
      const tasks = activeColumn.tasks;
      const oldIndex = tasks.findIndex((task) => task.id === activeId);

      if (oldIndex < 0) {
        return;
      }

      const overIndex = tasks.findIndex((task) => task.id === overId);
      const newIndex =
        overId === activeColumn.id ? tasks.length - 1 : overIndex;

      if (oldIndex === newIndex) {
        return;
      }

      updateColumns((current) =>
        current.map((column) =>
          column.id === activeColumn.id
            ? { ...column, tasks: arrayMove(column.tasks, oldIndex, newIndex) }
            : column
        )
      );

      await moveTask(orgId, projectId, activeId, {
        columnId: activeColumn.id,
        position: newIndex,
      });
    } else {
      const targetColumn = columns.find(
        (column) => column.id === overColumn.id
      );

      if (!targetColumn) {
        return;
      }

      const newIndex = targetColumn.tasks.findIndex(
        (task) => task.id === activeId
      );

      await moveTask(orgId, projectId, activeId, {
        columnId: targetColumn.id,
        position: newIndex >= 0 ? newIndex : targetColumn.tasks.length - 1,
      });
    }

    queryClient.invalidateQueries({
      queryKey: ["board", orgId, projectId],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!board) {
    return null;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveTask(null)}
    >
      <div className="flex items-start gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <BoardColumnView
            key={column.id}
            orgId={orgId}
            projectId={projectId}
            column={column}
            onOpenTask={setOpenTask}
          />
        ))}

        <AddColumnForm orgId={orgId} projectId={projectId} />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? <TaskCard task={activeTask} overlay /> : null}
      </DragOverlay>

      {openTask && (
        <TaskDialog
          orgId={orgId}
          projectId={projectId}
          task={openTask}
          onClose={() => setOpenTask(null)}
        />
      )}
    </DndContext>
  );
}