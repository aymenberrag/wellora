import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteProduction } from "../services/production";

export function useDeleteProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduction,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["production"],
      });
    },
  });
}