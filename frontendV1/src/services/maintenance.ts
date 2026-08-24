import api from "./api";

import type {
  Maintenance,
} from "../types/maintenance";
import type { PaginatedResponse } from "../types/pagination";

export async function getMaintenance(
  params?: Record<string, any>
): Promise<Maintenance[] | PaginatedResponse<Maintenance>> {
  const response = await api.get("/maintenance/", { params });
  return response.data;
}

export async function createMaintenance(
  data: any
) {
  const response = await api.post(
    "/maintenance/",
    data
  );

  return response.data;
}

export async function updateMaintenance(
  id: number,
  data: any
) {
  const response = await api.put(
    `/maintenance/${id}/`,
    data
  );

  return response.data;
}

export async function deleteMaintenance(
  id: number
) {
  await api.delete(
    `/maintenance/${id}/`
  );
}