import api from "./api";

import type {
  Maintenance,
} from "../types/maintenance";

export async function getMaintenance() {
  const response = await api.get<
    Maintenance[]
  >("/maintenance/");

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