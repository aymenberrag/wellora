import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import type {
  Maintenance,
  MaintenanceForm,
} from "../../types/maintenance";

import type { Well } from "../../types/well";
import type { Company } from "../../types/company";
import type { User } from "../../types/user";

interface Props {
  open: boolean;

  maintenance?: Maintenance | null;

  wells: Well[];

  companies: Company[];

  users: User[];

  onClose: () => void;

  onSubmit: (
    data: MaintenanceForm
  ) => void;
}

const initialForm: MaintenanceForm = {
  well: "",

  maintenance_type: "Preventive",

  title: "",

  description: "",

  service_company: "",

  assigned_to: "",

  start_date: "",

  start_time: "",

  end_date: "",

  end_time: "",

  estimated_cost: "",

  actual_cost: "",

  status: "Planned",

  remarks: "",
};

export default function MaintenanceModal({
  open,
  maintenance,
  wells,
  companies,
  users,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] =
    useState<MaintenanceForm>(
      initialForm
    );

  useEffect(() => {
    if (maintenance) {
      setForm({
        well: maintenance.well,

        maintenance_type:
          maintenance.maintenance_type,

        title: maintenance.title,

        description:
          maintenance.description ?? "",

        service_company:
          maintenance.service_company ??
          "",

        assigned_to:
          maintenance.assigned_to ??
          "",

        start_date:
          maintenance.start_date,

        start_time:
          maintenance.start_time ??
          "",

        end_date:
          maintenance.end_date ??
          "",

        end_time:
          maintenance.end_time ??
          "",

        estimated_cost:
          maintenance.estimated_cost ??
          "",

        actual_cost:
          maintenance.actual_cost ??
          "",

        status:
          maintenance.status,

        remarks:
          maintenance.remarks ?? "",
      });
    } else {
      setForm(initialForm);
    }
  }, [maintenance, open]);

  function handleChange(
    field: keyof MaintenanceForm,
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
        className="max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
                <div className="flex items-center justify-between border-b px-8 py-6">

          <div>

            <h2 className="text-2xl font-bold">

              {maintenance
                ? "Edit Maintenance"
                : "New Maintenance"}

            </h2>

            <p className="mt-1 text-slate-500">
              Schedule maintenance work
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

        <div className="grid gap-6 p-8 md:grid-cols-2">
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
              Maintenance Type
            </label>

            <select
              value={form.maintenance_type}
              onChange={(e) =>
                handleChange(
                  "maintenance_type",
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            >
              <option>Preventive</option>
              <option>Corrective</option>
              <option>Inspection</option>
              <option>Calibration</option>
              <option>Repair</option>
              <option>Replacement</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">
              Title
            </label>

            <input
              value={form.title}
              onChange={(e) =>
                handleChange(
                  "title",
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                handleChange(
                  "description",
                  e.target.value
                )
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Service Company
            </label>

            <select
              value={form.service_company}
              onChange={(e) =>
                handleChange(
                  "service_company",
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
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
            <label className="mb-2 block font-medium">
              Assigned To
            </label>

            <select
              value={form.assigned_to}
              onChange={(e) =>
                handleChange(
                  "assigned_to",
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            >
              <option value="">
                Select User
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
            <label className="mb-2 block font-medium">
              Start Date
            </label>

            <input
              type="date"
              value={form.start_date}
              onChange={(e) =>
                handleChange("start_date", e.target.value)
              }
              className="w-full rounded-xl border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Start Time
            </label>

            <input
              type="time"
              value={form.start_time}
              onChange={(e) =>
                handleChange("start_time", e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              End Date
            </label>

            <input
              type="date"
              value={form.end_date}
              onChange={(e) =>
                handleChange("end_date", e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              End Time
            </label>

            <input
              type="time"
              value={form.end_time}
              onChange={(e) =>
                handleChange("end_time", e.target.value)
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Estimated Cost
            </label>

            <input
              type="number"
              step="0.01"
              value={form.estimated_cost}
              onChange={(e) =>
                handleChange(
                  "estimated_cost",
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Actual Cost
            </label>

            <input
              type="number"
              step="0.01"
              value={form.actual_cost}
              onChange={(e) =>
                handleChange(
                  "actual_cost",
                  e.target.value === ""
                    ? ""
                    : Number(e.target.value)
                )
              }
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                handleChange("status", e.target.value)
              }
              className="w-full rounded-xl border p-3"
            >
              <option>Planned</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block font-medium">
              Remarks
            </label>

            <textarea
              rows={4}
              value={form.remarks}
              onChange={(e) =>
                handleChange("remarks", e.target.value)
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

            {maintenance
              ? "Update Maintenance"
              : "Create Maintenance"}
          </button>

        </div>

      </form>

    </div>
  );
}