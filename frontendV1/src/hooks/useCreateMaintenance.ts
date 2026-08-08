import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createMaintenance,
} from "../services/maintenance";

export function useCreateMaintenance() {

  const queryClient =
    useQueryClient();

  return useMutation({

    mutationFn: createMaintenance,

    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey: ["maintenance"],
      });

    },

  });

}