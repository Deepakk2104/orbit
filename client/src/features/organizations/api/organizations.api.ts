import { apiClient } from "@/lib/api-client";
import type { Organization } from "@/store/organization.store";

export interface Member {
  id: string;
  role: "OWNER" | "MEMBER";
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
}

export interface OrganizationDetails extends Organization {
  members: Member[];
}

export interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  createdAt: string;
  token?: string;
}

export const listOrganizations = async (): Promise<Organization[]> => {
  const response = await apiClient.get<{
    success: boolean;
    data: Organization[];
  }>("/organizations");

  return response.data.data;
};

export const createOrganization = async (
  data: { name: string }
): Promise<Organization> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Organization;
  }>("/organizations", data);

  return response.data.data;
};

export const getOrganization = async (
  orgId: string
): Promise<OrganizationDetails> => {
  const response = await apiClient.get<{
    success: boolean;
    data: OrganizationDetails;
  }>(`/organizations/${orgId}`);

  return response.data.data;
};

export const updateOrganization = async (
  orgId: string,
  data: { name: string }
): Promise<Organization> => {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: Organization;
  }>(`/organizations/${orgId}`, data);

  return response.data.data;
};

export const deleteOrganization = async (orgId: string): Promise<void> => {
  await apiClient.delete(`/organizations/${orgId}`);
};

export const inviteMember = async (
  orgId: string,
  data: { email: string }
): Promise<Invitation> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: Invitation;
  }>(`/organizations/${orgId}/invitations`, data);

  return response.data.data;
};

export const listMembers = async (orgId: string): Promise<Member[]> => {
  const response = await apiClient.get<{
    success: boolean;
    data: Member[];
  }>(`/organizations/${orgId}/members`);

  return response.data.data;
};

export const removeMember = async (
  orgId: string,
  memberId: string
): Promise<void> => {
  await apiClient.delete(`/organizations/${orgId}/members/${memberId}`);
};

export const acceptInvitation = async (
  token: string
): Promise<{
  role: "OWNER" | "MEMBER";
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}> => {
  const response = await apiClient.post<{
    success: boolean;
    message: string;
    data: {
      role: "OWNER" | "MEMBER";
      organization: {
        id: string;
        name: string;
        slug: string;
      };
    };
  }>(`/invitations/${token}/accept`);

  return response.data.data;
};