import { useQuery } from "@tanstack/react-query";

import { getFields } from "../services/field";

export function useFields() {
  return useQuery({
    queryKey: ["fields"],
    queryFn: getFields,
  });
}