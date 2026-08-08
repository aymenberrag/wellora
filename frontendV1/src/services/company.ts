import api from "./api";

export interface Company {
  id: number;
  name: string;
  short_name: string;
  company_type: string;
  country: string;
  city: string;
  email: string;
  phone: string;
  is_active: boolean;
}

export async function getCompanies(params?: Record<string, any>) {
  const { data } = await api.get("/companies/", { params });
  // If the response uses DRF pagination, return the whole payload
  if (data && typeof data === "object" && (data.results || data.count !== undefined)) {
    return data;
  }

  return data;
}

export async function createCompany(payload: Partial<Company>) {
  const { data } = await api.post("/companies/", payload);
  return data;
}

export async function updateCompany(
  id: number,
  payload: Partial<Company>
) {
  const { data } = await api.put(`/companies/${id}/`, payload);
  return data;
}

export async function deleteCompany(id: number) {
  await api.delete(`/companies/${id}/`);
}