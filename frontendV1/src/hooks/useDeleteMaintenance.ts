import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteMaintenance } from "../services/maintenance";

export function useDeleteMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMaintenance,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maintenance"],
      });
    },
  });
}