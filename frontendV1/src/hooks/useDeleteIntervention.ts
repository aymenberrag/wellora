import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteIntervention } from "../services/intervention";

export function useDeleteIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteIntervention,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["interventions"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}