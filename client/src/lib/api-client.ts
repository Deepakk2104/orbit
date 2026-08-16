"use client";

import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/auth.store";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

interface RefreshResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
  };
}

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

let refreshPromise: Promise<boolean> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableRequest | undefined;

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retried ||
      original.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    original._retried = true;

    if (!refreshPromise) {
      refreshPromise = apiClient
        .post<RefreshResponse>("/auth/refresh")
        .then((response) => {
          const { data } = response.data;

          useAuthStore.getState().setAuth(data.user, data.accessToken);

          return true;
        })
        .catch(() => {
          useAuthStore.getState().clearAuth();

          return false;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const success = await refreshPromise;

    if (!success) {
      return Promise.reject(error);
    }

    original.headers.Authorization = `Bearer ${useAuthStore.getState().accessToken}`;

    return apiClient(original);
  }
);