import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createWellTest } from "../services/wellTest";

export function useCreateWellTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWellTest,

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