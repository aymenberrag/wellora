export interface Intervention {
  id: number;

  well: number;
  well_name: string;

  intervention_type: string;

  title: string;

  description: string | null;

  service_company: number | null;
  company_name: string | null;

  supervisor: number | null;
  supervisor_name: string | null;

  start_date: string;
  start_time: string | null;

  end_date: string | null;
  end_time: string | null;

  status: string;

  remarks: string | null;

  created_at: string;
  updated_at: string;
}

export interface InterventionForm {
  well: number;

  intervention_type: string;

  title: string;

  description: string;

  service_company: number | "";

  supervisor: number | "";

  start_date: string;

  start_time: string;

  end_date: string;

  end_time: string;

  status: string;

  remarks: string;
}