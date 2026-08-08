export interface Production {
  id: number;

  well: number;
  well_name: string;
  well_code: string;

  field_name: string;
  operator_name: string;

  production_date: string;

  oil_production: number;
  gas_production: number;
  water_production: number;

  operating_hours: number;
  downtime_hours: number;

  remarks: string;

  created_at: string;
  updated_at: string;
}

export interface ProductionForm {
  well: number | "";

  production_date: string;

  oil_production: number | "";
  gas_production: number | "";
  water_production: number | "";

  operating_hours: number | "";
  downtime_hours: number | "";

  remarks: string;
}