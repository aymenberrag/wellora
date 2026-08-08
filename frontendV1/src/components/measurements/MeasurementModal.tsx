import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

import {
  createMeasurement,
  updateMeasurement,
  getDowntimeReasons,
  type Measurement,
  SHIFTS,
  OPERATING_STATUS,
} from "../../services/measurement";

import { getWells } from "../../services/well";

interface Well {
  id: number;
  code: string;
  name: string;
}

interface DowntimeReason {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  measurement?: Measurement | null;
}

type MeasurementForm = {
  well: string;
  measurement_date: string;
  shift: Measurement["shift"];
  operating_status: Measurement["operating_status"];
  wellhead_pressure: string;
  tubing_head_pressure: string;
  casing_pressure: string;
  flowline_pressure: string;
  wellhead_temperature: string;
  flowline_temperature: string;
  choke_size: string;
  esp_frequency: string;
  motor_current: string;
  water_cut: string;
  gor: string;
  bsw: string;
  downtime_hours: string;
  downtime_reason: string;
  remarks: string;
};

const initialForm: MeasurementForm = {
  well: "",

  measurement_date: new Date()
    .toISOString()
    .split("T")[0],

  shift: "Day",

  operating_status: "Running",

  wellhead_pressure: "",
  tubing_head_pressure: "",
  casing_pressure: "",
  flowline_pressure: "",

  wellhead_temperature: "",
  flowline_temperature: "",

  choke_size: "",

  esp_frequency: "",
  motor_current: "",

  water_cut: "",
  gor: "",
  bsw: "",

  downtime_hours: "0",

  downtime_reason: "",

  remarks: "",
};

export default function MeasurementModal({
  open,
  onClose,
  measurement,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [wells, setWells] =
    useState<Well[]>([]);

  const [reasons, setReasons] =
    useState<DowntimeReason[]>([]);

  const [form, setForm] =
    useState<MeasurementForm>(initialForm);

  useEffect(() => {
    if (!open) return;

    loadData();
  }, [open]);

  useEffect(() => {
    if (!measurement) {
      setForm(initialForm);
      return;
    }

    setForm({
      well: String(measurement.well),

      measurement_date:
        measurement.measurement_date,

      shift: measurement.shift,

      operating_status:
        measurement.operating_status,

      wellhead_pressure:
        measurement.wellhead_pressure ?? "",

      tubing_head_pressure:
        measurement.tubing_head_pressure ??
        "",

      casing_pressure:
        measurement.casing_pressure ?? "",

      flowline_pressure:
        measurement.flowline_pressure ??
        "",

      wellhead_temperature:
        measurement.wellhead_temperature ??
        "",

      flowline_temperature:
        measurement.flowline_temperature ??
        "",

      choke_size:
        measurement.choke_size ?? "",

      esp_frequency:
        measurement.esp_frequency ?? "",

      motor_current:
        measurement.motor_current ?? "",

      water_cut:
        measurement.water_cut ?? "",

      gor: measurement.gor ?? "",

      bsw: measurement.bsw ?? "",

      downtime_hours:
        measurement.downtime_hours,

      downtime_reason:
        measurement.downtime_reason
          ? String(
              measurement.downtime_reason
            )
          : "",

      remarks:
        measurement.remarks ?? "",
    });
  }, [measurement]);

  async function loadData() {
    const [wellsData, reasonsData] =
      await Promise.all([
        getWells(),
        getDowntimeReasons(),
      ]);

    setWells(wellsData);
    setReasons(reasonsData);
  }

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  }

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const payload: Partial<Measurement> = {
        ...form,

        well: Number(form.well),

        downtime_reason:
          form.downtime_reason === ""
            ? null
            : Number(
                form.downtime_reason
              ),
      };

      if (measurement) {
        await updateMeasurement(
          measurement.id,
          payload
        );
      } else {
        await createMeasurement(
          payload
        );
      }

      onClose();
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

      <form
        onSubmit={submit}
        className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >

        <div className="sticky top-0 flex items-center justify-between border-b bg-white p-6">

          <div>

            <h2 className="text-2xl font-bold">

              {measurement
                ? "Edit Measurement"
                : "New Measurement"}

            </h2>

            <p className="text-slate-500">

              Daily well operating data

            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
          >
            <X />
          </button>

        </div>

        <div className="space-y-8 p-8">

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              General Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Well
                </label>

                <select
                  required
                  value={form.well}
                  onChange={e =>
                    updateField(
                      "well",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                >
                  <option value="">
                    Select Well
                  </option>

                  {wells.map(well => (
                    <option
                      key={well.id}
                      value={well.id}
                    >
                      {well.code} - {well.name}
                    </option>
                  ))}

                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Date
                </label>

                <input
                  required
                  type="date"
                  value={
                    form.measurement_date
                  }
                  onChange={e =>
                    updateField(
                      "measurement_date",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Shift
                </label>

                <select
                  value={form.shift}
                  onChange={e =>
                    updateField(
                      "shift",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                >
                  {SHIFTS.map(shift => (
                    <option
                      key={shift}
                    >
                      {shift}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Operating Status
                </label>

                <select
                  value={
                    form.operating_status
                  }
                  onChange={e =>
                    updateField(
                      "operating_status",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                >
                  {OPERATING_STATUS.map(
                    status => (
                      <option
                        key={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>

          </div>
                    {/* Pressures */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Pressures (psi)
            </h3>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Wellhead Pressure
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.wellhead_pressure}
                  onChange={(e) =>
                    updateField(
                      "wellhead_pressure",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tubing Head Pressure
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.tubing_head_pressure}
                  onChange={(e) =>
                    updateField(
                      "tubing_head_pressure",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Casing Pressure
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.casing_pressure}
                  onChange={(e) =>
                    updateField(
                      "casing_pressure",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Flowline Pressure
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.flowline_pressure}
                  onChange={(e) =>
                    updateField(
                      "flowline_pressure",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />
              </div>

            </div>

          </div>

          {/* Temperatures */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Temperatures (°C)
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Wellhead Temperature
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.wellhead_temperature}
                  onChange={(e) =>
                    updateField(
                      "wellhead_temperature",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Flowline Temperature
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.flowline_temperature}
                  onChange={(e) =>
                    updateField(
                      "flowline_temperature",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

            </div>

          </div>

          {/* Artificial Lift */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Artificial Lift
            </h3>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Choke Size
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.choke_size}
                  onChange={(e) =>
                    updateField(
                      "choke_size",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  ESP Frequency (Hz)
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.esp_frequency}
                  onChange={(e) =>
                    updateField(
                      "esp_frequency",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Motor Current (A)
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.motor_current}
                  onChange={(e) =>
                    updateField(
                      "motor_current",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

            </div>

          </div>
                    {/* Fluid Properties */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Fluid Properties
            </h3>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Water Cut (%)
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.water_cut}
                  onChange={(e) =>
                    updateField(
                      "water_cut",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  GOR (scf/stb)
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.gor}
                  onChange={(e) =>
                    updateField(
                      "gor",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  BSW (%)
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.bsw}
                  onChange={(e) =>
                    updateField(
                      "bsw",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

            </div>

          </div>

          {/* Downtime */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Downtime
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Downtime Hours
                </label>

                <input
                  type="number"
                  step="0.01"
                  value={form.downtime_hours}
                  onChange={(e) =>
                    updateField(
                      "downtime_hours",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                />

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Downtime Reason
                </label>

                <select
                  value={form.downtime_reason}
                  onChange={(e) =>
                    updateField(
                      "downtime_reason",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border p-3"
                >

                  <option value="">
                    Select Reason
                  </option>

                  {reasons.map((reason) => (
                    <option
                      key={reason.id}
                      value={reason.id}
                    >
                      {reason.name}
                    </option>
                  ))}

                </select>

              </div>

            </div>

          </div>

          {/* Remarks */}

          <div>

            <h3 className="mb-4 text-xl font-semibold">
              Remarks
            </h3>

            <textarea
              rows={5}
              value={form.remarks}
              onChange={(e) =>
                updateField(
                  "remarks",
                  e.target.value
                )
              }
              placeholder="Operator remarks..."
              className="w-full rounded-xl border p-4"
            />

          </div>

        </div>

        {/* Footer */}

        <div className="sticky bottom-0 flex justify-end gap-4 border-t bg-white p-6">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-6 py-3"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >

            <Save size={18} />

            {loading
              ? "Saving..."
              : measurement
              ? "Update Measurement"
              : "Create Measurement"}

          </button>

        </div>

      </form>

    </div>
  );
}
// src/components/measurements/MeasurementDetailsModal.tsx

