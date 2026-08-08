export interface Maintenance {
  id: number;

  well: number;
  well_name: string;
  well_code: string;

  field_name: string;
  operator_name: string;

  title: string;
  description: string | null;

  maintenance_type:
    | "Preventive"
    | "Corrective"
    | "Inspection"
    | "Calibration"
    | "Repair"
    | "Replacement";

  service_company: number | null;
  service_company_name: string | null;

  assigned_to: number | null;
  assigned_to_name: string | null;

  start_date: string;
  start_time: string | null;

  end_date: string | null;
  end_time: string | null;

  estimated_cost: number | null;
  actual_cost: number | null;

  status:
    | "Planned"
    | "In Progress"
    | "Completed"
    | "Cancelled";

  remarks: string | null;

  created_at: string;
  updated_at: string;
}

export interface MaintenanceForm {
  well: number | "";

  maintenance_type: string;

  title: string;

  description: string;

  service_company: number | "";

  assigned_to: number | "";

  start_date: string;
  start_time: string;

  end_date: string;
  end_time: string;

  estimated_cost: number | "";

  actual_cost: number | "";

  status: string;

  remarks: string;
}