import api from "./api";

export interface LoginRequest {
  employee_id: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string | null;
  job_title: string | null;
  company: string | null;
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