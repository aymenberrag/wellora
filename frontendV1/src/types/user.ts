export interface User {
  id: number;

  username: string;

  first_name: string;

  last_name: string;

  full_name: string;

  company: number | null;

  company_name: string;

  job_title: string | null;

  role: string;

  is_active: boolean;
}