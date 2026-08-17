import { apiClient } from "@/lib/api-client";
import type { TaskComment } from "../types";

export const listComments = async (
  orgId: string,
  projectId: string,
  taskId: string
): Promise<TaskComment[]> => {
  const response = await apiClient.get<{
    success: boolean;
    data: TaskComment[];
  }>(`/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/comments`);

  return response.data.data;
};

export const createComment = async (
  orgId: string,
  projectId: string,
  taskId: string,
  data: { content: string }
): Promise<TaskComment> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: TaskComment;
  }>(
    `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/comments`,
    data
  );

  return response.data.data;
};

export const deleteComment = async (
  orgId: string,
  projectId: string,
  taskId: string,
  commentId: string
): Promise<void> => {
  await apiClient.delete(
    `/organizations/${orgId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`
  );
};
