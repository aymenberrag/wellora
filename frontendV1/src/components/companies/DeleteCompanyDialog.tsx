import { Trash2 } from "lucide-react";
import { deleteCompany } from "../../services/company";

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: number | null;
}

export default function DeleteCompanyDialog({
  open,
  onClose,
  companyId,
}: Props) {
  if (!open || !companyId) return null;

  async function handleDelete() {
    if (companyId === null) return;

    await deleteCompany(companyId);

    onClose();

    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white p-8">

        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <Trash2
            className="text-red-600"
            size={30}
          />
        </div>

        <h2 className="text-center text-2xl font-bold">
          Delete Company
        </h2>

        <p className="mt-3 text-center text-slate-500">
          This action cannot be undone.
        </p>

        <div className="mt-8 flex gap-4">

          <button
            onClick={onClose}
            className="flex-1 rounded-xl border py-3"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="flex-1 rounded-xl bg-red-600 py-3 text-white"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  );
}