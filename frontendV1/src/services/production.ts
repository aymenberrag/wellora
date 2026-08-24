import api from "./api";
import type { Production } from "../types/production";
import type { PaginatedResponse } from "../types/pagination";

export async function getProductions(
  params?: Record<string, any>
): Promise<Production[] | PaginatedResponse<Production>> {
  const response = await api.get("/production/", { params });
  return response.data;
}

export async function createProduction(
  data: Partial<Production>
) {
  const response = await api.post(
    "/production/",
    data
  );

  return response.data;
}

export async function updateProduction(
  id: number,
  data: Partial<Production>
) {
  const response = await api.put(
    `/production/${id}/`,
    data
  );

  return response.data;
}

export async function deleteProduction(
  id: number
) {
  await api.delete(`/production/${id}/`);
}