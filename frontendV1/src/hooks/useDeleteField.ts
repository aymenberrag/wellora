import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteField } from "../services/field";

export function useDeleteField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteField,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fields"],
      });
    },
  });
}