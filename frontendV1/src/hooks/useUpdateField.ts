import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateField } from "../services/field";

export function useUpdateField() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => updateField(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["fields"],
      });
    },
  });
}