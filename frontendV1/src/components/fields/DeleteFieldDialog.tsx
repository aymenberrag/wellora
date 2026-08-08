import { Trash2 } from "lucide-react";

import { useDeleteField } from "../../hooks/useDeleteField";

interface Props {
  open: boolean;
  fieldId: number | null;
  onClose(): void;
}

export default function DeleteFieldDialog({
  open,
  fieldId,
  onClose,
}: Props) {
  const mutation = useDeleteField();

  if (!open || fieldId === null)
    return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white p-8">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">

          <Trash2
            size={38}
            className="text-red-600"
          />

        </div>

        <h2 className="mt-5 text-center text-2xl font-bold">
          Delete Field
        </h2>

        <p className="mt-3 text-center text-slate-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl border py-3"
          >
            Cancel
          </button>

          <button
            onClick={() =>
              mutation.mutate(fieldId, {
                onSuccess: onClose,
              })
            }
            className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}