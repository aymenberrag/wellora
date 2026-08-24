import { useQuery, keepPreviousData } from "@tanstack/react-query";

import {
  getMaintenance,
} from "../services/maintenance";

export function useMaintenance(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["maintenance", params || {}],
    queryFn: () => getMaintenance(params || {}),
    placeholderData: keepPreviousData,
  });
}