import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getWells } from "../services/well";

export function useWells(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["wells", params || {}],
    queryFn: () => getWells(params || {}),
    placeholderData: keepPreviousData,
  });
}