import { apiClient } from "@/lib/api-client";
import type { BoardTask, TaskPriority } from "@/features/board/types";

export interface TaskInput {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
}

export const createTask = async (
  orgId: string,
  projectId: string,
  columnId: string,
  data: TaskInput
): Promise<BoardTask> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: BoardTask;
  }>(
    `/organizations/${orgId}/projects/${projectId}/board/columns/${columnId}/tasks`,
    data
  );

  return response.data.data;
};

export const updateTask = async (
  orgId: string,
  projectId: string,
  taskId: string,
  data: TaskInput
): Promise<BoardTask> => {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: BoardTask;
  }>(`/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`, data);

  return response.data.data;
};

export const deleteTask = async (
  orgId: string,
  projectId: string,
  taskId: string
): Promise<void> => {
  await apiClient.delete(
    `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}`
  );
};

export const moveTask = async (
  orgId: string,
  projectId: string,
  taskId: string,
  data: { columnId: string; position: number }
): Promise<void> => {
  await apiClient.patch(
    `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/move`,
    data
  );
};