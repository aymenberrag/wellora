import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateWellTest } from "../services/wellTest";

export function useUpdateWellTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => updateWellTest(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["well-tests"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}