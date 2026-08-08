import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateIntervention } from "../services/intervention";
import type { InterventionForm } from "../types/intervention";

interface UpdateData {
  id: number;
  data: InterventionForm;
}

export function useUpdateIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateData) =>
      updateIntervention(id, data),

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