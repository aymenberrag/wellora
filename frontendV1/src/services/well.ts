import api from "./api";
import type { PaginatedResponse } from "../types/pagination";

export type WellType =
  | "Oil"
  | "Gas"
  | "Water Injector"
  | "Gas Injector"
  | "Exploration";

export type WellStatus =
  | "Drilling"
  | "Producing"
  | "Shut In"
  | "Workover"
  | "Abandoned";

export type ArtificialLift =
  | "Natural Flow"
  | "ESP"
  | "Gas Lift"
  | "Rod Pump"
  | "PCP"
  | "Other";

export interface Well {
  id: number;

  code: string;
  name: string;

  field: number;
  field_name: string;

  operator: number;
  operator_name: string;

  well_type: WellType;
  status: WellStatus;

  spud_date: string | null;
  completion_date: string | null;
  first_production_date: string | null;

  total_depth: string | null;
  true_vertical_depth: string | null;

  tubing_size: string | null;
  casing_size: string | null;

  artificial_lift: ArtificialLift | null;

  reservoir: string | null;
  formation: string | null;

  latitude: string | null;
  longitude: string | null;

  description: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export const WELL_TYPES: WellType[] = [
  "Oil",
  "Gas",
  "Water Injector",
  "Gas Injector",
  "Exploration",
];

export const WELL_STATUS: WellStatus[] = [
  "Drilling",
  "Producing",
  "Shut In",
  "Workover",
  "Abandoned",
];

export const ARTIFICIAL_LIFTS: ArtificialLift[] = [
  "Natural Flow",
  "ESP",
  "Gas Lift",
  "Rod Pump",
  "PCP",
  "Other",
];

export async function getWells(
  params?: Record<string, any>
): Promise<Well[] | PaginatedResponse<Well>> {
  const { data } = await api.get("/wells/", { params });
  return data;
}

export async function getWell(id: number): Promise<Well> {
  const { data } = await api.get(`/wells/${id}/`);
  return data;
}

export async function createWell(
  payload: Partial<Well>
) {
  const { data } = await api.post(
    "/wells/",
    payload
  );

  return data;
}

export async function updateWell(
  id: number,
  payload: Partial<Well>
) {
  const { data } = await api.put(
    `/wells/${id}/`,
    payload
  );

  return data;
}

export async function deleteWell(
  id: number
) {
  await api.delete(`/wells/${id}/`);
}