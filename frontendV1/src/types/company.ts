export interface Company {
  id: number;

  name: string;

  code: string;

  company_type: string;

  country: string;

  city: string;

  address: string;

  email: string;

  phone: string;

  website: string;

  contact_person: string;

  description: string | null;

  is_active: boolean;

  created_at: string;

  updated_at: string;
}

export interface CompanyForm {
  name: string;

  code: string;

  company_type: string;

  country: string;

  city: string;

  address: string;

  email: string;

  phone: string;

  website: string;

  contact_person: string;

  description: string;

  is_active: boolean;
}