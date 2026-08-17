import { apiClient } from "@/lib/api-client";
import type { Board } from "../types";

export const getBoard = async (
  orgId: string,
  projectId: string
): Promise<Board> => {
  const response = await apiClient.get<{
    success: boolean;
    data: Board;
  }>(`/organizations/${orgId}/projects/${projectId}/board`);

  return response.data.data;
};

export const createBoard = async (
  orgId: string,
  projectId: string
): Promise<Board> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Board;
  }>(`/organizations/${orgId}/projects/${projectId}/board`);

  return response.data.data;
};