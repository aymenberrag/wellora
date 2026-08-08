import api from "./api";

import type {
  Maintenance,
} from "../types/maintenance";

export async function getMaintenance(params?: Record<string, any>) {
  const response = await api.get("/maintenance/", { params });
  const data = response.data;
  if (data && typeof data === "object" && (data.results || data.count !== undefined)) {
    return data;
  }
  return data;
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