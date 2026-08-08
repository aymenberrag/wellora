import api from "./api";

import type { User } from "../types/user";

export async function getUsers() {
  const response = await api.get<User[]>("/auth/users/");
  return response.data;
}