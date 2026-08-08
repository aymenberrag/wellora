import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createMeasurement } from "../services/measurement";

export function useCreateMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMeasurement,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["measurements"],
      });
    },
  });
}