import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateMaintenance } from "../services/maintenance";

export function useUpdateMaintenance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: any;
    }) => updateMaintenance(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["maintenance"],
      });
    },
  });
}