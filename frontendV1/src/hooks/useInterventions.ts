import { useQuery } from "@tanstack/react-query";

import { getInterventions } from "../services/intervention";

export function useInterventions() {
  return useQuery({
    queryKey: ["interventions"],
    queryFn: getInterventions,
  });
}