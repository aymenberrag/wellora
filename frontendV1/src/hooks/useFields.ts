import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getFields } from "../services/field";

export function useFields(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["fields", params || {}],
    queryFn: () => getFields(params || {}),
    placeholderData: keepPreviousData,
  });
}