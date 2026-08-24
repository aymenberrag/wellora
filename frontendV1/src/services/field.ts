import api from "./api";
import type { PaginatedResponse } from "../types/pagination";

export interface Field {
  id: number;
  name: string;
  code: string;

  operator: number;

  country: string | null;
  state: string | null;
  city: string | null;

  latitude: string | null;
  longitude: string | null;

  status:
    | "Active"
    | "Development"
    | "Inactive"
    | "Abandoned";

  description: string | null;

  created_at: string;
  updated_at: string;
}

export const FIELD_STATUS = [
  "Active",
  "Development",
  "Inactive",
  "Abandoned",
];

export async function getFields(
  params?: Record<string, any>
): Promise<Field[] | PaginatedResponse<Field>> {
  const { data } = await api.get("/fields/", { params });
  return data;
}

export async function createField(
  payload: Partial<Field>
) {
  const { data } = await api.post(
    "/fields/",
    payload
  );

  return data;
}

export async function updateField(
  id: number,
  payload: Partial<Field>
) {
  const { data } = await api.put(
    `/fields/${id}/`,
    payload
  );

  return data;
}

export async function deleteField(
  id: number
) {
  await api.delete(`/fields/${id}/`);
}