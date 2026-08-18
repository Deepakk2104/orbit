import { apiClient } from "@/lib/api-client";
import type { DashboardData } from "../types";

export const getDashboard = async (orgId: string): Promise<DashboardData> => {
  const response = await apiClient.get<{
    success: boolean;
    data: DashboardData;
  }>(`/organizations/${orgId}/dashboard`);

  return response.data.data;
};
