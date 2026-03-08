import { apiClient } from "./client";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface UserMe {
  id: number;
  email: string;
  username: string;
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>("/auth/login/", payload);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await apiClient.post<UserMe>("/auth/register/", payload);
  return data;
}

export async function getMe(): Promise<UserMe> {
  const { data } = await apiClient.get<UserMe>("/auth/me/");
  return data;
}
