import axios from "axios";
import type { RegisterFormData } from "../schemas/register.schema";
import type { LoginFormData } from "../schemas/login.schema";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

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
  const response = await axios.post<RegisterResponse>(
    `${API_URL}/auth/register`,
    {
      name: data.name,
      email: data.email,
      password: data.password,
    }
  );

  return response.data;
};


export interface LoginResponse {
  success: boolean;
  message: string;
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

export const loginUser = async (
  data: LoginFormData
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    `${API_URL}/auth/login`,
    data,
    {
      withCredentials: true,
    }
  );

  return response.data;
};