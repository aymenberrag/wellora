import { Trash2 } from "lucide-react";

import { useDeleteMeasurement } from "../../hooks/useDeleteMeasurement";

interface Props {
  open: boolean;
  onClose: () => void;
  measurementId: number | null;
}

export default function DeleteMeasurementDialog({
  open,
  onClose,
  measurementId,
}: Props) {
  const mutation = useDeleteMeasurement();

  if (!open || measurementId === null) return null;

  async function handleDelete() {
    await mutation.mutateAsync(measurementId ?? 0);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Trash2 className="text-red-600" size={30} />
        </div>

        <h2 className="text-center text-2xl font-bold">
          Delete Measurement
        </h2>

        <p className="mt-3 text-center text-slate-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-xl border px-5 py-3"
          >
            Cancel
          </button>

          <button
            disabled={mutation.isPending}
            onClick={handleDelete}
            className="rounded-xl bg-red-600 px-5 py-3 text-white disabled:opacity-50"
          >
            {mutation.isPending
              ? "Deleting..."
              : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}