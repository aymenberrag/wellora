import { useQuery, keepPreviousData } from "@tanstack/react-query";

import { getWellTests } from "../services/wellTest";

export function useWellTests(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["well-tests", params || {}],
    queryFn: () => getWellTests(params || {}),
    placeholderData: keepPreviousData,
  });
}