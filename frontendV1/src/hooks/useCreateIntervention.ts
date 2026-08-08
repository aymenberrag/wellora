import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createIntervention } from "../services/intervention";

export function useCreateIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIntervention,

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