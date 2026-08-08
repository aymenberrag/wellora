import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createWell } from "../services/well";

export function useCreateWell() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWell,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wells"],
      });
    },
  });
}