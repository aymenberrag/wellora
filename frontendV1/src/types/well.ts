export interface Well {
  id: number;

  code: string;
  name: string;

  field: number;
  operator: number;

  field_name: string;
  operator_name: string;

  well_type:
    | "Oil"
    | "Gas"
    | "Water Injector"
    | "Gas Injector"
    | "Exploration";

  status:
    | "Drilling"
    | "Producing"
    | "Shut In"
    | "Workover"
    | "Abandoned";

  spud_date: string | null;
  completion_date: string | null;
  first_production_date: string | null;

  total_depth: number | null;
  true_vertical_depth: number | null;

  tubing_size: string | null;
  casing_size: string | null;

  artificial_lift:
    | "Natural Flow"
    | "ESP"
    | "Gas Lift"
    | "Rod Pump"
    | "PCP"
    | "Other"
    | null;

  reservoir: string | null;
  formation: string | null;

  latitude: number | null;
  longitude: number | null;

  description: string | null;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface WellForm {
  code: string;
  name: string;

  field: number | "";
  operator: number | "";

  well_type:
    | "Oil"
    | "Gas"
    | "Water Injector"
    | "Gas Injector"
    | "Exploration";

  status:
    | "Drilling"
    | "Producing"
    | "Shut In"
    | "Workover"
    | "Abandoned";

  spud_date: string;
  completion_date: string;
  first_production_date: string;

  total_depth: number | "";
  true_vertical_depth: number | "";

  tubing_size: string;
  casing_size: string;

  artificial_lift:
    | "Natural Flow"
    | "ESP"
    | "Gas Lift"
    | "Rod Pump"
    | "PCP"
    | "Other"
    | "";

  reservoir: string;
  formation: string;

  latitude: number | "";
  longitude: number | "";

  description: string;

  is_active: boolean;
}