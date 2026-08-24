import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getInterventions } from "../services/intervention";

export function useInterventions(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["interventions", params || {}],
    queryFn: () => getInterventions(params || {}),
    placeholderData: keepPreviousData,
  });
}