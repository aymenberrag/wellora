import api from "./api";


export type Shift = "Day" | "Night";

export type OperatingStatus =
  | "Running"
  | "Shut In"
  | "Maintenance"
  | "Startup"
  | "Shutdown";

export interface Measurement {
  id: number;

  well: number;
  well_name: string;
  well_code: string;

  field_name: string;
  operator_name: string;

  measurement_date: string;
  shift: Shift;

  recorded_by: number | null;
  recorded_by_name: string | null;

  operating_status: OperatingStatus;

  wellhead_pressure: string | null;
  tubing_head_pressure: string | null;
  casing_pressure: string | null;
  flowline_pressure: string | null;

  wellhead_temperature: string | null;
  flowline_temperature: string | null;

  choke_size: string | null;

  esp_frequency: string | null;
  motor_current: string | null;

  water_cut: string | null;
  gor: string | null;
  bsw: string | null;

  downtime_hours: string;

  downtime_reason: number | null;
  downtime_reason_name: string | null;

  remarks: string | null;

  created_at: string;
  updated_at: string;
}

export interface DowntimeReason {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
}

export const SHIFTS: Shift[] = [
  "Day",
  "Night",
];

export const OPERATING_STATUS: OperatingStatus[] = [
  "Running",
  "Shut In",
  "Maintenance",
  "Startup",
  "Shutdown",
];

export async function getMeasurements() {
  const { data } = await api.get("/measurements/measurements/");
  return data;
}

export async function createMeasurement(
  payload: Partial<Measurement>
) {
  const { data } = await api.post(
    "/measurements/measurements/",
    payload
  );

  return data;
}

export async function updateMeasurement(
  id: number,
  payload: Partial<Measurement>
) {
  const { data } = await api.put(
    `/measurements/measurements/${id}/`,
    payload
  );

  return data;
}

export async function deleteMeasurement(
  id: number
) {
  await api.delete(
    `/measurements/measurements/${id}/`
  );
}

export async function getDowntimeReasons(
  params?: Record<string, any>
): Promise<DowntimeReason[]> {
  const { data } = await api.get("/measurements/downtime-reasons/", { params });

  if (Array.isArray(data)) {
    return data;
  }

  if (data?.results && Array.isArray(data.results)) {
    return data.results;
  }

  return [];
}