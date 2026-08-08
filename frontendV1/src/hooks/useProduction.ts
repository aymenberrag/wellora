import { useQuery } from "@tanstack/react-query";

import { getProductions } from "../services/production";

export function useProduction(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["production", params || {}],
    queryFn: () => getProductions(params || {}),
    keepPreviousData: true,
  });
}