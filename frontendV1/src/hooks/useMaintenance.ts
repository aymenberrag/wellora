import { useQuery } from "@tanstack/react-query";

import {
  getMaintenance,
} from "../services/maintenance";

export function useMaintenance() {
  return useQuery({
    queryKey: ["maintenance"],
    queryFn: getMaintenance,
  });
}