import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import type { Well } from "../../types/well";
import type {
  WellTest,
  WellTestForm,
} from "../../types/wellTest";

interface Props {
  open: boolean;
  onClose: () => void;

  wellTest?: WellTest | null;

  wells: Well[];

  onSubmit: (data: WellTestForm) => void;

  loading?: boolean;
}

export default function WellTestModal({
  open,
  onClose,
  wellTest,
  wells,
  onSubmit,
  loading = false,
}: Props) {
  const [form, setForm] =
    useState<WellTestForm>({
      well: 0,

      test_date: "",

      oil_rate: 0,

      gas_rate: 0,

      water_rate: 0,

      wellhead_pressure: "",

      bottomhole_pressure: "",

      choke_size: "",

      water_cut: "",

      gor: "",

      remarks: "",
    });

  useEffect(() => {
    if (!open) return;

    if (wellTest) {
      setForm({
        well: wellTest.well,

        test_date:
          wellTest.test_date,

        oil_rate:
          Number(wellTest.oil_rate),

        gas_rate:
          Number(wellTest.gas_rate),

        water_rate:
          Number(wellTest.water_rate),

        wellhead_pressure:
          wellTest.wellhead_pressure ?? "",

        bottomhole_pressure:
          wellTest.bottomhole_pressure ?? "",

        choke_size:
          wellTest.choke_size ?? "",

        water_cut:
          wellTest.water_cut ?? "",

        gor:
          wellTest.gor ?? "",

        remarks:
          wellTest.remarks ?? "",
      });
    } else {
      setForm({
        well: 0,

        test_date: "",

        oil_rate: 0,

        gas_rate: 0,

        water_rate: 0,

        wellhead_pressure: "",

        bottomhole_pressure: "",

        choke_size: "",

        water_cut: "",

        gor: "",

        remarks: "",
      });
    }
  }, [open, wellTest]);
    const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "well"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-2xl font-bold">
            {wellTest
              ? "Edit Well Test"
              : "New Well Test"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium">
                Well
              </label>

              <select
                required
                name="well"
                value={form.well}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option value="">
                  Select Well
                </option>

                {wells.map((well) => (
                  <option
                    key={well.id}
                    value={well.id}
                  >
                    {well.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Test Date
              </label>

              <input
                required
                type="date"
                name="test_date"
                value={form.test_date}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Oil Rate (BOPD)
              </label>

              <input
                type="number"
                step="0.01"
                name="oil_rate"
                value={form.oil_rate}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Gas Rate (MSCFD)
              </label>

              <input
                type="number"
                step="0.01"
                name="gas_rate"
                value={form.gas_rate}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Water Rate (BWPD)
              </label>

              <input
                type="number"
                step="0.01"
                name="water_rate"
                value={form.water_rate}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Wellhead Pressure (psi)
              </label>

              <input
                type="number"
                step="0.01"
                name="wellhead_pressure"
                value={form.wellhead_pressure}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>
                        <div>
              <label className="mb-2 block text-sm font-medium">
                Bottomhole Pressure (psi)
              </label>

              <input
                type="number"
                step="0.01"
                name="bottomhole_pressure"
                value={form.bottomhole_pressure}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Choke Size (1/64")
              </label>

              <input
                type="number"
                step="0.01"
                name="choke_size"
                value={form.choke_size}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Water Cut (%)
              </label>

              <input
                type="number"
                step="0.01"
                name="water_cut"
                value={form.water_cut}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                GOR (scf/STB)
              </label>

              <input
                type="number"
                step="0.01"
                name="gor"
                value={form.gor}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Remarks
              </label>

              <textarea
                rows={4}
                name="remarks"
                value={form.remarks}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 border-t pt-6">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save size={18} />

              {loading
                ? "Saving..."
                : wellTest
                ? "Update Well Test"
                : "Create Well Test"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}