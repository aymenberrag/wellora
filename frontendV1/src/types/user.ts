export interface User {
  id: number;

  username: string;

  first_name: string;

  last_name: string;

  full_name: string;

  company: number | string | null;

  company_name: string;

  job_title: string | null;

  email?: string | null;

  phone_number?: string | null;

  country?: string | null;

  state?: string | null;

  city?: string | null;

  address?: string | null;

  hire_date?: string | null;

  role: string;

  permissions?: string[];

  is_active: boolean;
}