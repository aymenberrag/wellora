// src/components/measurements/MeasurementDetailsModal.tsx

import { X } from "lucide-react";
import type { Measurement } from "../../services/measurement";

interface Props {
  open: boolean;
  onClose: () => void;
  measurement: Measurement | null;
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex items-center justify-between border-b py-3">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="font-semibold text-slate-900">
        {value !== null && value !== undefined && value !== ""
          ? value
          : "-"}
      </span>
    </div>
  );
}

export default function MeasurementDetailsModal({
  open,
  onClose,
  measurement,
}: Props) {
  if (!open || !measurement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-8 py-6">
          <div>
            <h2 className="text-2xl font-bold">
              Measurement Details
            </h2>

            <p className="mt-1 text-slate-500">
              {measurement.well_code} • {measurement.measurement_date}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid gap-8 p-8 lg:grid-cols-2">

          {/* General */}

          <section className="rounded-xl border p-6">
            <h3 className="mb-5 text-lg font-bold">
              General Information
            </h3>

            <DetailRow label="Well Code" value={measurement.well_code} />
            <DetailRow label="Well Name" value={measurement.well_name} />
            <DetailRow label="Field" value={measurement.field_name} />
            <DetailRow label="Operator" value={measurement.operator_name} />
            <DetailRow label="Date" value={measurement.measurement_date} />
            <DetailRow label="Shift" value={measurement.shift} />
            <DetailRow label="Status" value={measurement.operating_status} />
            <DetailRow
              label="Recorded By"
              value={measurement.recorded_by_name}
            />
          </section>

          {/* Pressures */}

          <section className="rounded-xl border p-6">
            <h3 className="mb-5 text-lg font-bold">
              Pressures (psi)
            </h3>

            <DetailRow
              label="Wellhead Pressure"
              value={measurement.wellhead_pressure}
            />

            <DetailRow
              label="Tubing Head Pressure"
              value={measurement.tubing_head_pressure}
            />

            <DetailRow
              label="Casing Pressure"
              value={measurement.casing_pressure}
            />

            <DetailRow
              label="Flowline Pressure"
              value={measurement.flowline_pressure}
            />
          </section>

          {/* Temperatures */}

          <section className="rounded-xl border p-6">
            <h3 className="mb-5 text-lg font-bold">
              Temperatures
            </h3>

            <DetailRow
              label="Wellhead Temperature"
              value={measurement.wellhead_temperature}
            />

            <DetailRow
              label="Flowline Temperature"
              value={measurement.flowline_temperature}
            />

            <DetailRow
              label="Choke Size"
              value={measurement.choke_size}
            />
          </section>

          {/* Artificial Lift */}

          <section className="rounded-xl border p-6">
            <h3 className="mb-5 text-lg font-bold">
              Artificial Lift
            </h3>

            <DetailRow
              label="ESP Frequency"
              value={measurement.esp_frequency}
            />

            <DetailRow
              label="Motor Current"
              value={measurement.motor_current}
            />
          </section>

          {/* Fluids */}

          <section className="rounded-xl border p-6">
            <h3 className="mb-5 text-lg font-bold">
              Fluid Properties
            </h3>

            <DetailRow
              label="Water Cut (%)"
              value={measurement.water_cut}
            />

            <DetailRow
              label="GOR"
              value={measurement.gor}
            />

            <DetailRow
              label="BSW"
              value={measurement.bsw}
            />
          </section>

          {/* Downtime */}

          <section className="rounded-xl border p-6">
            <h3 className="mb-5 text-lg font-bold">
              Downtime
            </h3>

            <DetailRow
              label="Hours"
              value={measurement.downtime_hours}
            />

            <DetailRow
              label="Reason"
              value={measurement.downtime_reason_name}
            />
          </section>

        </div>

        <div className="border-t p-8">

          <h3 className="mb-4 text-lg font-bold">
            Remarks
          </h3>

          <div className="min-h-32 rounded-xl bg-slate-50 p-5 whitespace-pre-wrap">
            {measurement.remarks || "No remarks"}
          </div>

        </div>

      </div>
    </div>
  );
}