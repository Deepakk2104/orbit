import type { QueryClient } from "@tanstack/react-query";
import type { Board, BoardColumn, BoardTask } from "../types";

export const boardQueryKey = (orgId: string, projectId: string) => [
  "board",
  orgId,
  projectId,
];

export const appendTask = (
  queryClient: QueryClient,
  key: string[],
  task: BoardTask
) => {
  queryClient.setQueryData<Board>(key, (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      columns: current.columns.map((column) =>
        column.id === task.columnId
          ? { ...column, tasks: [...column.tasks, task] }
          : column
      ),
    };
  });
};

export const patchTask = (
  queryClient: QueryClient,
  key: string[],
  taskId: string,
  updater: (task: BoardTask) => BoardTask
) => {
  queryClient.setQueryData<Board>(key, (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      columns: current.columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? updater(task) : task
        ),
      })),
    };
  });
};

export const removeTask = (
  queryClient: QueryClient,
  key: string[],
  taskId: string
) => {
  queryClient.setQueryData<Board>(key, (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      columns: current.columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => task.id !== taskId),
      })),
    };
  });
};

export const appendColumn = (
  queryClient: QueryClient,
  key: string[],
  column: BoardColumn
) => {
  queryClient.setQueryData<Board>(key, (current) => {
    if (!current) {
      return current;
    }

    return { ...current, columns: [...current.columns, column] };
  });
};

export const patchColumn = (
  queryClient: QueryClient,
  key: string[],
  columnId: string,
  updater: (column: BoardColumn) => BoardColumn
) => {
  queryClient.setQueryData<Board>(key, (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      columns: current.columns.map((column) =>
        column.id === columnId ? updater(column) : column
      ),
    };
  });
};

export const removeColumn = (
  queryClient: QueryClient,
  key: string[],
  columnId: string
) => {
  queryClient.setQueryData<Board>(key, (current) => {
    if (!current) {
      return current;
    }

    return {
      ...current,
      columns: current.columns.filter((column) => column.id !== columnId),
    };
  });
};
