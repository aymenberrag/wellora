import { useQuery } from "@tanstack/react-query";

import { getWells } from "../services/well";

export function useWells() {
  return useQuery({
    queryKey: ["wells"],
    queryFn: getWells,
  });
}