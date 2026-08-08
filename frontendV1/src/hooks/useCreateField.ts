import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { createField } from "../services/field";

export function useCreateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createField,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fields"],
      });
    },
  });
}