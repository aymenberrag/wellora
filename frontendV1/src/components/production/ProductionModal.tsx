import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

import type {
  Production,
  ProductionForm,
} from "../../types/production";

import type { Well } from "../../types/well";

interface Props {
  open: boolean;

  production?: Production | null;

  wells: Well[];

  onClose: () => void;

  onSubmit: (data: ProductionForm) => void;
}

const initialForm: ProductionForm = {
  well: "",

  production_date: "",

  oil_production: "",

  gas_production: "",

  water_production: "",

  operating_hours: 24,

  downtime_hours: 0,

  remarks: "",
};

export default function ProductionModal({
  open,
  production,
  wells,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<ProductionForm>(initialForm);

  useEffect(() => {
    if (production) {
      setForm({
        well: production.well,

        production_date:
          production.production_date,

        oil_production:
          production.oil_production,

        gas_production:
          production.gas_production,

        water_production:
          production.water_production,

        operating_hours:
          production.operating_hours,

        downtime_hours:
          production.downtime_hours,

        remarks:
          production.remarks || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [production, open]);

  function handleChange(
    field: keyof ProductionForm,
    value: any
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    onSubmit(form);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">

      <form
        onSubmit={submit}
        className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
                <div className="flex items-center justify-between border-b px-8 py-6">

          <div>

            <h2 className="text-2xl font-bold">

              {production
                ? "Edit Production"
                : "New Production"}

            </h2>

            <p className="mt-1 text-slate-500">
              Daily production report
            </p>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="grid gap-8 p-8 md:grid-cols-2">

          <div>

            <label className="mb-2 block font-medium">
              Well
            </label>

            <select
              value={form.well}
              onChange={(e) =>
                handleChange(
                  "well",
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
              required
            >

              <option value="">
                Select Well
              </option>

              {wells.map((well) => (

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

            <label className="mb-2 block font-medium">
              Production Date
            </label>

            <input
              type="date"
              value={form.production_date}
              onChange={(e) =>
                handleChange(
                  "production_date",
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              required
            />

          </div>
                    <div>
            <label className="mb-2 block font-medium">
              Oil Production (BOPD)
            </label>

            <input
              type="number"
              step="0.01"
              value={form.oil_production}
              onChange={(e) =>
                handleChange(
                  "oil_production",
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Gas Production (MSCFD)
            </label>

            <input
              type="number"
              step="0.01"
              value={form.gas_production}
              onChange={(e) =>
                handleChange(
                  "gas_production",
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Water Production (BWPD)
            </label>

            <input
              type="number"
              step="0.01"
              value={form.water_production}
              onChange={(e) =>
                handleChange(
                  "water_production",
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Operating Hours
            </label>

            <input
              type="number"
              step="0.01"
              value={form.operating_hours}
              onChange={(e) =>
                handleChange(
                  "operating_hours",
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Downtime Hours
            </label>

            <input
              type="number"
              step="0.01"
              value={form.downtime_hours}
              onChange={(e) =>
                handleChange(
                  "downtime_hours",
                  Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="md:col-span-2">

            <label className="mb-2 block font-medium">
              Remarks
            </label>

            <textarea
              rows={4}
              value={form.remarks}
              onChange={(e) =>
                handleChange(
                  "remarks",
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />

          </div>

        </div>

        <div className="flex justify-end gap-3 border-t px-8 py-6">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Save size={18} />

            {production
              ? "Update Production"
              : "Create Production"}

          </button>

        </div>

      </form>

    </div>
  );
}