import { useQuery } from "@tanstack/react-query";

import { getWellTests } from "../services/wellTest";

export function useWellTests() {
  return useQuery({
    queryKey: ["well-tests"],
    queryFn: getWellTests,
  });
}