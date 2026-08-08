import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteWell } from "../services/well";

export function useDeleteWell() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWell,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wells"],
      });
    },
  });
}