import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { Field } from "../../services/field";
import {
  FIELD_STATUS,
  createField,
  updateField,
} from "../../services/field";

import { getCompanies } from "../../services/company";

interface Props {
  open: boolean;
  field?: Field | null;
  onClose(): void;
}

interface Company {
  id: number;
  name: string;
}

export default function FieldModal({
  open,
  field,
  onClose,
}: Props) {
  const [companies, setCompanies] = useState<Company[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    name: "",
    code: "",
    operator: "",

    country: "",
    state: "",
    city: "",

    latitude: "",
    longitude: "",

    status: "Active",

    description: "",
  });

  useEffect(() => {
    getCompanies().then(setCompanies);
  }, []);

  useEffect(() => {
    if (!field) {
      setForm({
        name: "",
        code: "",
        operator: "",
        country: "",
        state: "",
        city: "",
        latitude: "",
        longitude: "",
        status: "Active",
        description: "",
      });

      return;
    }

    setForm({
      name: field.name,
      code: field.code,

      operator: String(
        field.operator
      ),

      country:
        field.country ?? "",

      state:
        field.state ?? "",

      city:
        field.city ?? "",

      latitude:
        field.latitude ?? "",

      longitude:
        field.longitude ?? "",

      status:
        field.status,

      description:
        field.description ?? "",
    });
  }, [field]);

  if (!open) return null;

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }

  async function save(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const payload = {
      ...form,
      operator: Number(
        form.operator
      ),
    };

    if (field)
      await updateField(
        field.id,
        payload
      );
    else
      await createField(
        payload
      );

    setLoading(false);

    window.location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">

              {field
                ? "Edit Field"
                : "New Field"}

            </h2>

            <p className="text-slate-500">

              Oil Field Information

            </p>

          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <form
          onSubmit={save}
          className="grid gap-5 p-6 md:grid-cols-2"
        >

          <input
            name="name"
            placeholder="Field Name"
            value={form.name}
            onChange={handleChange}
            className="rounded-xl border p-3"
            required
          />

          <input
            name="code"
            placeholder="Code"
            value={form.code}
            onChange={handleChange}
            className="rounded-xl border p-3"
            required
          />

          <select
            name="operator"
            value={form.operator}
            onChange={handleChange}
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
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-xl border p-3"
          >
            {FIELD_STATUS.map((s) => (
              <option key={s}>
                {s}
              </option>
            ))}
          </select>

          <input
            name="country"
            placeholder="Country"
            value={form.country}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="state"
            placeholder="State"
            value={form.state}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="latitude"
            placeholder="Latitude"
            value={form.latitude}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <input
            name="longitude"
            placeholder="Longitude"
            value={form.longitude}
            onChange={handleChange}
            className="rounded-xl border p-3"
          />

          <textarea
            name="description"
            rows={5}
            placeholder="Description..."
            value={form.description}
            onChange={handleChange}
            className="rounded-xl border p-3 md:col-span-2"
          />

          <div className="flex justify-end gap-3 md:col-span-2">

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
              {loading
                ? "Saving..."
                : "Save"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}