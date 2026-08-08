import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateProduction } from "../services/production";

export function useUpdateProduction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => updateProduction(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["production"],
      });
    },
  });
}