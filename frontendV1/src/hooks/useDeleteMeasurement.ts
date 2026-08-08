import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteMeasurement } from "../services/measurement";

export function useDeleteMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMeasurement,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["measurements"],
      });
    },
  });
}