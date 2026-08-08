import { X } from "lucide-react";

import type { Production } from "../../types/production";

interface Props {
  open: boolean;
  production: Production | null;
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
    <div className="flex items-center justify-between border-b py-3">
      <span className="font-medium text-slate-500">
        {label}
      </span>

      <span className="font-semibold text-slate-800">
        {value ?? "-"}
      </span>
    </div>
  );
}

export default function ProductionDetailsModal({
  open,
  production,
  onClose,
}: Props) {
  if (!open || !production) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-8 py-6">

          <div>
            <h2 className="text-2xl font-bold">
              Production Details
            </h2>

            <p className="mt-1 text-slate-500">
              {production.well_code} • {production.production_date}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="grid gap-8 p-8 md:grid-cols-2">

          <div className="rounded-xl border p-6">

            <h3 className="mb-5 text-lg font-bold">
              General
            </h3>

            <Row label="Well" value={production.well_name} />
            <Row label="Code" value={production.well_code} />
            <Row label="Field" value={production.field_name} />
            <Row label="Operator" value={production.operator_name} />
            <Row label="Date" value={production.production_date} />

          </div>

          <div className="rounded-xl border p-6">

            <h3 className="mb-5 text-lg font-bold">
              Production
            </h3>

            <Row
              label="Oil"
              value={`${production.oil_production} BOPD`}
            />

            <Row
              label="Gas"
              value={`${production.gas_production} MSCFD`}
            />

            <Row
              label="Water"
              value={`${production.water_production} BWPD`}
            />

            <Row
              label="Operating Hours"
              value={production.operating_hours}
            />

            <Row
              label="Downtime"
              value={production.downtime_hours}
            />

          </div>

        </div>

        <div className="border-t p-8">

          <h3 className="mb-4 text-lg font-bold">
            Remarks
          </h3>

          <div className="min-h-28 rounded-xl bg-slate-50 p-4 whitespace-pre-wrap">
            {production.remarks || "No remarks"}
          </div>

        </div>

      </div>

    </div>
  );
}