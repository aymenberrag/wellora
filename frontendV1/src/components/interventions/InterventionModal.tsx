import { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

import type { Intervention } from "../../types/intervention";
import type { Well } from "../../types/well";
import type { Company } from "../../types/company";
import type { User } from "../../types/user";

interface Props {
  open: boolean;
  onClose: () => void;

  intervention?: Intervention | null;

  wells: Well[];
  companies: Company[];
  users: User[];

  onSubmit: (data: FormData) => void;

  loading?: boolean;
}

interface FormData {
  well: number;

  intervention_type: string;

  title: string;

  description: string;

  service_company: number | "";

  supervisor: number | "";

  start_date: string;

  start_time: string;

  end_date: string;

  end_time: string;

  status: string;

  remarks: string;
}

const interventionTypes = [
  "Wireline",
  "Slickline",
  "Coiled Tubing",
  "Acid Stimulation",
  "Hydraulic Fracturing",
  "ESP Installation",
  "ESP Replacement",
  "Tubing Replacement",
  "Cementing",
  "Perforation",
  "Fishing",
  "Well Kill",
  "Other",
];

const statuses = [
  "Planned",
  "In Progress",
  "Completed",
  "Cancelled",
];

export default function InterventionModal({
  open,
  onClose,
  intervention,
  wells,
  companies,
  users,
  onSubmit,
  loading = false,
}: Props) {
  const [form, setForm] = useState<FormData>({
    well: 0,

    intervention_type: "",

    title: "",

    description: "",

    service_company: "",

    supervisor: "",

    start_date: "",

    start_time: "",

    end_date: "",

    end_time: "",

    status: "Planned",

    remarks: "",
  });
    useEffect(() => {
    if (!open) return;

    if (intervention) {
      setForm({
        well: intervention.well,

        intervention_type:
          intervention.intervention_type,

        title: intervention.title,

        description:
          intervention.description ?? "",

        service_company:
          intervention.service_company ?? "",

        supervisor:
          intervention.supervisor ?? "",

        start_date:
          intervention.start_date ?? "",

        start_time:
          intervention.start_time ?? "",

        end_date:
          intervention.end_date ?? "",

        end_time:
          intervention.end_time ?? "",

        status: intervention.status,

        remarks:
          intervention.remarks ?? "",
      });
    } else {
      setForm({
        well: 0,

        intervention_type: "",

        title: "",

        description: "",

        service_company: "",

        supervisor: "",

        start_date: "",

        start_time: "",

        end_date: "",

        end_time: "",

        status: "Planned",

        remarks: "",
      });
    }
  }, [intervention, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "well" ||
        name === "service_company" ||
        name === "supervisor"
          ? value === ""
            ? ""
            : Number(value)
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
      <div className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-bold">
            {intervention
              ? "Edit Intervention"
              : "New Intervention"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
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
                name="well"
                value={form.well}
                onChange={handleChange}
                required
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
                Intervention Type
              </label>

              <select
                name="intervention_type"
                value={form.intervention_type}
                onChange={handleChange}
                required
                className="w-full rounded-xl border p-3"
              >
                <option value="">
                  Select Type
                </option>

                {interventionTypes.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Title
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                rows={4}
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Service Company
              </label>

              <select
                name="service_company"
                value={form.service_company}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option value="">
                  Select Company
                </option>

                {companies.map((company) => (
                  <option
                    key={company.id}
                    value={company.id}
                  >
                    {company.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Supervisor
              </label>

              <select
                name="supervisor"
                value={form.supervisor}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              >
                <option value="">
                  Select Supervisor
                </option>

                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.full_name} ({user.username})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Date
              </label>

              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Time
              </label>

              <input
                type="time"
                name="start_time"
                value={form.start_time}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                End Date
              </label>

              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                End Time
              </label>

              <input
                type="time"
                name="end_time"
                value={form.end_time}
                onChange={handleChange}
                className="w-full rounded-xl border p-3"
              />
            </div>
                        <div>
              <label className="mb-2 block text-sm font-medium">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:outline-none"
              >
                {statuses.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>
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
                className="w-full rounded-xl border border-slate-300 p-3 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-6 py-3 font-medium transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />

              {loading
                ? "Saving..."
                : intervention
                ? "Update Intervention"
                : "Create Intervention"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}