import { apiClient } from "@/lib/api-client";

export interface Column {
  id: string;
  name: string;
  position: number;
  boardId: string;
  createdAt: string;
}

export const createColumn = async (
  orgId: string,
  projectId: string,
  data: { name: string }
): Promise<Column> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Column;
  }>(`/organizations/${orgId}/projects/${projectId}/board/columns`, data);

  return response.data.data;
};

export const updateColumn = async (
  orgId: string,
  projectId: string,
  columnId: string,
  data: { name: string }
): Promise<Column> => {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: Column;
  }>(
    `/organizations/${orgId}/projects/${projectId}/board/columns/${columnId}`,
    data
  );

  return response.data.data;
};

export const deleteColumn = async (
  orgId: string,
  projectId: string,
  columnId: string
): Promise<void> => {
  await apiClient.delete(
    `/organizations/${orgId}/projects/${projectId}/board/columns/${columnId}`
  );
};
