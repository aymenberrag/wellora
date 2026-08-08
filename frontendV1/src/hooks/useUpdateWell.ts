import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateWell } from "../services/well";

export function useUpdateWell() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => updateWell(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wells"],
      });
    },
  });
}