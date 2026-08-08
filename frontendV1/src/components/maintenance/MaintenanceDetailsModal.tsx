import { X } from "lucide-react";

import type { Maintenance } from "../../types/maintenance";

interface Props {
  open: boolean;
  maintenance: Maintenance | null;
  onClose: () => void;
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between border-b py-3">
      <span className="font-medium text-slate-500">
        {label}
      </span>

      <span className="font-semibold">
        {value || "-"}
      </span>
    </div>
  );
}

export default function MaintenanceDetailsModal({
  open,
  maintenance,
  onClose,
}: Props) {
  if (!open || !maintenance) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b px-8 py-6">

          <h2 className="text-2xl font-bold">
            Maintenance Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="grid gap-8 p-8 md:grid-cols-2">

          <div className="rounded-xl border p-6">

            <Row label="Well" value={maintenance.well_name} />
            <Row label="Code" value={maintenance.well_code} />
            <Row label="Title" value={maintenance.title} />
            <Row label="Type" value={maintenance.maintenance_type} />
            <Row label="Status" value={maintenance.status} />

          </div>

          <div className="rounded-xl border p-6">

            <Row label="Start" value={maintenance.start_date} />
            <Row label="End" value={maintenance.end_date} />
            <Row label="Estimated Cost" value={maintenance.estimated_cost} />
            <Row label="Actual Cost" value={maintenance.actual_cost} />
            <Row label="Company" value={maintenance.service_company_name} />

          </div>

        </div>

        <div className="border-t p-8">

          <h3 className="mb-3 text-lg font-bold">
            Description
          </h3>

          <p className="rounded-xl bg-slate-50 p-4 whitespace-pre-wrap">
            {maintenance.description || "No description"}
          </p>

          <h3 className="mb-3 mt-6 text-lg font-bold">
            Remarks
          </h3>

          <p className="rounded-xl bg-slate-50 p-4 whitespace-pre-wrap">
            {maintenance.remarks || "No remarks"}
          </p>

        </div>

      </div>

    </div>
  );
}