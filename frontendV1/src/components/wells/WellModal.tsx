// src/components/wells/WellModal.tsx

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type {
  Well,
  WellType,
  WellStatus,
  ArtificialLift,
} from "../../services/well";

import {
  WELL_TYPES,
  WELL_STATUS,
  ARTIFICIAL_LIFTS,
  createWell,
  updateWell,
} from "../../services/well";

import { getFields } from "../../services/field";
import { getCompanies } from "../../services/company";

interface Props {
  open: boolean;
  well?: Well | null;
  onClose(): void;
}

interface FieldOption {
  id: number;
  name: string;
}

interface CompanyOption {
  id: number;
  name: string;
}

export default function WellModal({
  open,
  well,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState<FieldOption[]>([]);
  const [companies, setCompanies] = useState<CompanyOption[]>([]);

  const [form, setForm] = useState({
    code: "",
    name: "",

    field: "",
    operator: "",

    well_type: "Oil" as WellType,
    status: "Producing" as WellStatus,

    spud_date: "",
    completion_date: "",
    first_production_date: "",

    total_depth: "",
    true_vertical_depth: "",

    tubing_size: "",
    casing_size: "",

    artificial_lift: "" as ArtificialLift | "",

    reservoir: "",
    formation: "",

    latitude: "",
    longitude: "",

    description: "",

    is_active: true,
  });

  useEffect(() => {
    if (!open) return;

    getFields().then((res: any) => setFields(res));
    getCompanies().then((res: any) => setCompanies(res));
  }, [open]);

  useEffect(() => {
    if (!well) {
      setForm({
        code: "",
        name: "",

        field: "",
        operator: "",

        well_type: "Oil",
        status: "Producing",

        spud_date: "",
        completion_date: "",
        first_production_date: "",

        total_depth: "",
        true_vertical_depth: "",

        tubing_size: "",
        casing_size: "",

        artificial_lift: "",

        reservoir: "",
        formation: "",

        latitude: "",
        longitude: "",

        description: "",

        is_active: true,
      });

      return;
    }

    setForm({
      code: well.code,
      name: well.name,

      field: String(well.field),
      operator: String(well.operator),

      well_type: well.well_type,
      status: well.status,

      spud_date: well.spud_date ?? "",
      completion_date: well.completion_date ?? "",
      first_production_date:
        well.first_production_date ?? "",

      total_depth: well.total_depth ?? "",
      true_vertical_depth:
        well.true_vertical_depth ?? "",

      tubing_size: well.tubing_size ?? "",
      casing_size: well.casing_size ?? "",

      artificial_lift:
        well.artificial_lift ?? "",

      reservoir: well.reservoir ?? "",
      formation: well.formation ?? "",

      latitude: well.latitude ?? "",
      longitude: well.longitude ?? "",

      description: well.description ?? "",

      is_active: well.is_active,
    });
  }, [well]);

  if (!open) return null;

  function change(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  }

  async function submit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const payload = {
      ...form,
      field: Number(form.field),
      operator: Number(form.operator),
      artificial_lift:
        form.artificial_lift || null,
    };

    try {
      if (well) {
        await updateWell(well.id, payload);
      } else {
        await createWell(payload);
      }

      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-8">

      <div className="mx-auto max-w-6xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>
            <h2 className="text-2xl font-bold">
              {well ? "Edit Well" : "New Well"}
            </h2>

            <p className="text-slate-500">
              Well Information
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <form
          onSubmit={submit}
          className="space-y-8 p-8"
        >
          <section>
            <h3 className="mb-4 text-lg font-semibold">
              General Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              <input
                name="code"
                value={form.code}
                onChange={change}
                placeholder="Well Code"
                className="rounded-xl border p-3"
                required
              />

              <input
                name="name"
                value={form.name}
                onChange={change}
                placeholder="Well Name"
                className="rounded-xl border p-3"
                required
              />

              <select
                name="field"
                value={form.field}
                onChange={change}
                className="rounded-xl border p-3"
                required
              >
                <option value="">
                  Select Field
                </option>

                {fields.map((f) => (
                  <option
                    key={f.id}
                    value={f.id}
                  >
                    {f.name}
                  </option>
                ))}
              </select>

              <select
                name="operator"
                value={form.operator}
                onChange={change}
                className="rounded-xl border p-3"
                required
              >
                <option value="">
                  Select Operator
                </option>

                {companies.map((c) => (
                  <option
                    key={c.id}
                    value={c.id}
                  >
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                name="well_type"
                value={form.well_type}
                onChange={change}
                className="rounded-xl border p-3"
              >
                {WELL_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <select
                name="status"
                value={form.status}
                onChange={change}
                className="rounded-xl border p-3"
              >
                {WELL_STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <select
                name="artificial_lift"
                value={form.artificial_lift}
                onChange={change}
                className="rounded-xl border p-3"
              >
                <option value="">
                  Select Lift
                </option>

                {ARTIFICIAL_LIFTS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>

              <label className="flex items-center gap-3 rounded-xl border p-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={change}
                />

                Active Well
              </label>

            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Dates
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <input
                type="date"
                name="spud_date"
                value={form.spud_date}
                onChange={change}
                className="rounded-xl border p-3"
              />

              <input
                type="date"
                name="completion_date"
                value={form.completion_date}
                onChange={change}
                className="rounded-xl border p-3"
              />

              <input
                type="date"
                name="first_production_date"
                value={form.first_production_date}
                onChange={change}
                className="rounded-xl border p-3"
              />

            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Technical Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              <input
                name="total_depth"
                value={form.total_depth}
                onChange={change}
                placeholder="Total Depth (m)"
                className="rounded-xl border p-3"
              />

              <input
                name="true_vertical_depth"
                value={form.true_vertical_depth}
                onChange={change}
                placeholder="TVD (m)"
                className="rounded-xl border p-3"
              />

              <input
                name="tubing_size"
                value={form.tubing_size}
                onChange={change}
                placeholder="Tubing Size"
                className="rounded-xl border p-3"
              />

              <input
                name="casing_size"
                value={form.casing_size}
                onChange={change}
                placeholder="Casing Size"
                className="rounded-xl border p-3"
              />

            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Reservoir Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                name="reservoir"
                value={form.reservoir}
                onChange={change}
                placeholder="Reservoir"
                className="rounded-xl border p-3"
              />

              <input
                name="formation"
                value={form.formation}
                onChange={change}
                placeholder="Formation"
                className="rounded-xl border p-3"
              />

            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Location
            </h3>

            <div className="grid gap-4 md:grid-cols-2">

              <input
                name="latitude"
                value={form.latitude}
                onChange={change}
                placeholder="Latitude"
                className="rounded-xl border p-3"
              />

              <input
                name="longitude"
                value={form.longitude}
                onChange={change}
                placeholder="Longitude"
                className="rounded-xl border p-3"
              />

            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold">
              Description
            </h3>

            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={change}
              className="w-full rounded-xl border p-4"
            />
          </section>

          <div className="flex justify-end gap-4 border-t pt-6">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-6 py-3"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white"
            >
              {loading ? "Saving..." : "Save Well"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}