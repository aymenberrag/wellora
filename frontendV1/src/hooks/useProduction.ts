import { useQuery } from "@tanstack/react-query";

import { getProductions } from "../services/production";

export function useProduction() {
  return useQuery({
    queryKey: ["production"],
    queryFn: getProductions,
  });
}