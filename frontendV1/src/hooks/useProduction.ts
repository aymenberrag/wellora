import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getProductions } from "../services/production";

export function useProduction(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["production", params || {}],
    queryFn: () => getProductions(params || {}),
    placeholderData: keepPreviousData,
  });
}