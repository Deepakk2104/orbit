import { apiClient } from "@/lib/api-client";
import type { AuthUser } from "@/store/auth.store";
import type { UpdateProfileFormData } from "../schemas/update-profile.schema";
import type { ChangePasswordFormData } from "../schemas/change-password.schema";

export const updateProfile = async (
  data: UpdateProfileFormData
): Promise<AuthUser> => {
  const response = await apiClient.patch<{
    success: boolean;
    message: string;
    data: AuthUser;
  }>("/users/profile", {
    name: data.name,
    avatar: data.avatar?.trim() || null,
  });

  return response.data.data;
};

export const changePassword = async (
  data: ChangePasswordFormData
): Promise<void> => {
  await apiClient.patch("/users/password", {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
};
