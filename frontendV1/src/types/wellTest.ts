export interface WellTest {
  id: number;

  well: number;
  well_name: string;

  test_date: string;

  oil_rate: number;

  gas_rate: number;

  water_rate: number;

  wellhead_pressure: number | null;

  bottomhole_pressure: number | null;

  choke_size: number | null;

  water_cut: number | null;

  gor: number | null;

  remarks: string | null;

  created_at: string;
  updated_at: string;
}

export interface WellTestForm {
  well: number;

  test_date: string;

  oil_rate: number;

  gas_rate: number;

  water_rate: number;

  wellhead_pressure: number | "";

  bottomhole_pressure: number | "";

  choke_size: number | "";

  water_cut: number | "";

  gor: number | "";

  remarks: string;
}