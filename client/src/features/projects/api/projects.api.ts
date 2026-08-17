import { apiClient } from "@/lib/api-client";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export const listProjects = async (orgId: string): Promise<Project[]> => {
  const response = await apiClient.get<{
    success: boolean;
    data: Project[];
  }>(`/organizations/${orgId}/projects`);

  return response.data.data;
};

export const createProject = async (
  orgId: string,
  data: { name: string; description?: string }
): Promise<Project> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Project;
  }>(`/organizations/${orgId}/projects`, data);

  return response.data.data;
};

export const getProject = async (
  orgId: string,
  projectId: string
): Promise<Project> => {
  const response = await apiClient.get<{
    success: boolean;
    data: Project;
  }>(`/organizations/${orgId}/projects/${projectId}`);

  return response.data.data;
};

export const updateProject = async (
  orgId: string,
  projectId: string,
  data: { name: string; description?: string | null }
): Promise<Project> => {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: Project;
  }>(`/organizations/${orgId}/projects/${projectId}`, data);

  return response.data.data;
};

export const deleteProject = async (
  orgId: string,
  projectId: string
): Promise<void> => {
  await apiClient.delete(`/organizations/${orgId}/projects/${projectId}`);
};