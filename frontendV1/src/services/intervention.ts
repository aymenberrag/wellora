import api from "./api";
import type {
  Intervention,
  InterventionForm,
} from "../types/intervention";

export async function getInterventions() {
  const response = await api.get<Intervention[]>("/interventions/");
  return response.data;
}

export async function createIntervention(
  data: InterventionForm
) {
  const response = await api.post<Intervention>(
    "/interventions/",
    data
  );
  return response.data;
}

export async function updateIntervention(
  id: number,
  data: InterventionForm
) {
  const response = await api.put<Intervention>(
    `/interventions/${id}/`,
    data
  );
  return response.data;
}

export async function deleteIntervention(id: number) {
  await api.delete(`/interventions/${id}/`);
}