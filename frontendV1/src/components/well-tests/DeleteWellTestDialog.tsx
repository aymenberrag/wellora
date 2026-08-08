import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export default function DeleteWellTestDialog({
  open,
  onClose,
  onConfirm,
  loading = false,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">

        <div className="flex flex-col items-center p-8">

          <div className="mb-5 rounded-full bg-red-100 p-4">
            <AlertTriangle
              size={40}
              className="text-red-600"
            />
          </div>

          <h2 className="text-2xl font-bold text-slate-800">
            Delete Well Test
          </h2>

          <p className="mt-4 text-center text-slate-500">
            Are you sure you want to delete this well test?
          </p>

          <p className="mt-2 text-center text-sm text-red-500">
            This action cannot be undone.
          </p>

          <div className="mt-8 flex w-full gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-300 py-3 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 rounded-xl bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}