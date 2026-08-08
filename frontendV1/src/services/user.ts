import api from "./api";

import type { User } from "../types/user";

export async function getUsers(params?: Record<string, any>) {
  const response = await api.get("/auth/users/", { params });
  const data = response.data;
  if (data && typeof data === "object" && (data.results || data.count !== undefined)) {
    return data;
  }
  return data;
}