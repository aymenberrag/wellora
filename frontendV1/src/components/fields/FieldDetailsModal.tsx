import { X } from "lucide-react";

import type { Field } from "../../services/field";

interface Props {
  open: boolean;
  field: Field | null;
  onClose(): void;
}

export default function FieldDetailsModal({
  open,
  field,
  onClose,
}: Props) {
  if (!open || !field) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              {field.name}
            </h2>

            <p className="text-slate-500">
              {field.code}
            </p>

          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="grid gap-6 p-6 md:grid-cols-2">

          <Info
            label="Status"
            value={field.status}
          />

          <Info
            label="Operator ID"
            value={String(field.operator)}
          />

          <Info
            label="Country"
            value={field.country ?? "-"}
          />

          <Info
            label="State"
            value={field.state ?? "-"}
          />

          <Info
            label="City"
            value={field.city ?? "-"}
          />

          <Info
            label="Latitude"
            value={field.latitude ?? "-"}
          />

          <Info
            label="Longitude"
            value={field.longitude ?? "-"}
          />

          <div className="md:col-span-2">

            <label className="text-sm text-slate-500">
              Description
            </label>

            <div className="mt-2 rounded-xl border bg-slate-50 p-4">
              {field.description || "-"}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>

      <label className="text-sm text-slate-500">
        {label}
      </label>

      <div className="mt-2 rounded-xl border bg-slate-50 p-3 font-medium">
        {value}
      </div>

    </div>
  );
}