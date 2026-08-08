import api from "./api";
import type { User } from "../types/user";

export interface LoginRequest {
  employee_id: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export async function login(data: LoginRequest) {
  const response = await api.post<LoginResponse>("/auth/login/", data);
  return response.data;
}

export async function logout(refresh: string) {
  await api.post("/auth/logout/", {
    refresh,
  });
}

export async function getProfile() {
  const response = await api.get<User>("/auth/profile/");
  return response.data;
}

export async function updateProfile(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  country: string;
  state: string;
  city: string;
  address: string;
}) {
  const response = await api.patch<User>("/auth/profile/", data);
  return response.data;
}

export async function changePassword(data: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}) {
  const response = await api.post("/auth/change-password/", data);
  return response.data;
}