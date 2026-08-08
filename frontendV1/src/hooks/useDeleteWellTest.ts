import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteWellTest } from "../services/wellTest";

export function useDeleteWellTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWellTest,

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