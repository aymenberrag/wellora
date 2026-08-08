import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createProduction } from "../services/production";

export function useCreateProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["production"],
      });
    },
  });
}