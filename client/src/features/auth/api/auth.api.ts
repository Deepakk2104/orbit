import type { AuthUser } from "@/store/auth.store";
import { useAuthStore } from "@/store/auth.store";
import { apiClient } from "@/lib/api-client";
import type { RegisterFormData } from "../schemas/register.schema";
import type { LoginFormData } from "../schemas/login.schema";

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    createdAt: string;
  };
}

export const registerUser = async (
  data: RegisterFormData
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return response.data;
};

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: AuthUser;
  };
}

export const loginUser = async (
  data: LoginFormData
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", data);

  return response.data;
};

export const getCurrentUser = async (): Promise<AuthUser> => {
  const response = await apiClient.get<{
    success: boolean;
    data: AuthUser;
  }>("/auth/me");

  return response.data.data;
};

export const refreshSession = async (): Promise<boolean> => {
  try {
    const response = await apiClient.post<LoginResponse>("/auth/refresh");

    const { data } = response.data;

    useAuthStore.getState().setAuth(data.user, data.accessToken);

    return true;
  } catch {
    useAuthStore.getState().clearAuth();

    return false;
  }
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};

export const resetPassword = async (data: {
  token: string;
  password: string;
}) => {
  const response = await apiClient.post("/auth/reset-password", data);

  return response.data;
};
