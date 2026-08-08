import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/user";

export function useUsers(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["users", params || {}],
    queryFn: () => getUsers(params || {}),
    placeholderData: (previousData) => previousData,
  });
}