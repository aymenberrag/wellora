import api from "./api";
import type {
  WellTest,
  WellTestForm,
} from "../types/wellTest";

export async function getWellTests(params?: Record<string, any>) {
  const response = await api.get("/well-tests/", { params });
  const data = response.data;
  if (data && typeof data === "object" && (data.results || data.count !== undefined)) {
    return data;
  }
  return data;
}

export async function createWellTest(
  data: WellTestForm
) {
  const response = await api.post<WellTest>(
    "/well-tests/",
    data
  );

  return response.data;
}

export async function updateWellTest(
  id: number,
  data: WellTestForm
) {
  const response = await api.put<WellTest>(
    `/well-tests/${id}/`,
    data
  );

  return response.data;
}

export async function deleteWellTest(
  id: number
) {
  await api.delete(`/well-tests/${id}/`);
}