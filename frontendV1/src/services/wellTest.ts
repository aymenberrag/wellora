import api from "./api";
import type {
  WellTest,
  WellTestForm,
} from "../types/wellTest";
import type { PaginatedResponse } from "../types/pagination";

export async function getWellTests(
  params?: Record<string, any>
): Promise<WellTest[] | PaginatedResponse<WellTest>> {
  const response = await api.get("/well-tests/", { params });
  return response.data;
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