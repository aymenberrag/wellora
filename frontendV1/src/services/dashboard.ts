import api from "./api";

export interface Measurement {
  id: number;

  well_code: string;
  well_name: string;

  field_name: string;
  operator_name: string;

  measurement_date: string;

  operating_status: string;

  wellhead_pressure: number | null;

  water_cut: number | null;
}

export interface Production {
  id: number;
  well: string;
  production_date: string;
  oil_production: number;
}

export interface Maintenance {
  id: number;
  well: string;
  maintenance_type: string;
  status: string;
}

export interface Intervention {
  id: number;
  well: string;
  intervention_type: string;
  status: string;
}

export interface ProductionTrend {
  date: string;
  oil: number;
  gas: number;
  water: number;
}

export interface DashboardData {
  total_companies: number;
  total_fields: number;
  total_wells: number;

  running_wells: number;

  maintenance_wells: number;

  measurement_count: number;

  avg_whp: number;

  avg_water_cut: number;

  today_oil: number;
  today_gas: number;
  today_water: number;

  ongoing_maintenance: number;
  ongoing_interventions: number;

  production_trend?: ProductionTrend[];

  recent_measurements: Measurement[];
  recent_production: Production[];
  recent_maintenance: Maintenance[];
  recent_interventions: Intervention[];
}

export async function getDashboard() {
  const response = await api.get<DashboardData>("/dashboard/");
  return response.data;
}