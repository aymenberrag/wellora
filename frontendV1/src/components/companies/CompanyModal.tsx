import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  createCompany,
  updateCompany,
  type Company,
} from "../../services/company";

interface Props {
  open: boolean;
  onClose: () => void;
  company?: Company | null;
}

export default function CompanyModal({
  open,
  onClose,
  company,
}: Props) {
  const COMPANY_TYPES = [
    "Oil Company",
    "Service Company",
    "Drilling Contractor",
    "Government",
    "Consulting",
    "Other",
  ];
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    short_name: "",
    company_type: "",
    country: "",
    city: "",
    email: "",
    phone: "",
    is_active: true,
  });

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name,
        short_name: company.short_name,
        company_type: company.company_type,
        country: company.country,
        city: company.city,
        email: company.email,
        phone: company.phone,
        is_active: company.is_active,
      });
    } else {
      setForm({
        name: "",
        short_name: "",
        company_type: "",
        country: "",
        city: "",
        email: "",
        phone: "",
        is_active: true,
      });
    }
  }, [company]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      if (company) {
        await updateCompany(company.id, form);
      } else {
        await createCompany(form);
      }

      onClose();

      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              {company ? "Edit Company" : "New Company"}
            </h2>

            <p className="text-slate-500">
              Company information
            </p>

          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >

          <div className="grid gap-5 md:grid-cols-2">

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Company Name"
              className="rounded-xl border p-3"
              required
            />

            <input
              name="short_name"
              value={form.short_name}
              onChange={handleChange}
              placeholder="Short Name"
              className="rounded-xl border p-3"
              required
            />

            <div>

              <label className="mb-2 block text-sm font-medium">
                Company Type
              </label>

              <select
                name="company_type"
                value={form.company_type}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white p-3 outline-none focus:border-blue-600"
                required
              >
                <option value="">
                  Select Company Type
                </option>

                {COMPANY_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>

            </div>

            <input
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
              className="rounded-xl border p-3"
            />

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="rounded-xl border p-3"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="rounded-xl border p-3"
            />

            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="rounded-xl border p-3"
            />

            <select
              name="is_active"
              value={String(form.is_active)}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_active: e.target.value === "true",
                })
              }
              className="rounded-xl border p-3"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>

          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border px-6 py-3"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              {loading
                ? "Saving..."
                : company
                ? "Update"
                : "Create"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}