import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateMeasurement } from "../services/measurement";

export function useUpdateMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => updateMeasurement(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["measurements"],
      });
    },
  });
}