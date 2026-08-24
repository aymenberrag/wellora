import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getMeasurements } from "../services/measurement";

export function useMeasurements(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["measurements", params || {}],
    queryFn: () => getMeasurements(params || {}),
    placeholderData: keepPreviousData,
  });
}