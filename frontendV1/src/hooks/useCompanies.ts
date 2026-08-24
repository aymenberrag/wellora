import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCompanies } from "../services/company";

export function useCompanies(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["companies", params || {}],
    queryFn: () => getCompanies(params || {}),
    placeholderData: keepPreviousData,
  });
}