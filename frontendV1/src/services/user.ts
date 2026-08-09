import api from "./api";

import type { User } from "../types/user";

export async function getUsers(
  params?: Record<string, any>
): Promise<User[]> {
  const { data } = await api.get("/auth/users/", { params });

  if (Array.isArray(data)) {
    return data;
  }

  if (data?.results && Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}