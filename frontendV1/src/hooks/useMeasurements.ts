import { useQuery } from "@tanstack/react-query";

import { getMeasurements } from "../services/measurement";

export function useMeasurements() {
  return useQuery({
    queryKey: ["measurements"],
    queryFn: getMeasurements,
  });
}