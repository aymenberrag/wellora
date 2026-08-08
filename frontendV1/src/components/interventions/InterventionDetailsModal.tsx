import { X } from "lucide-react";

import type { Intervention } from "../../types/intervention";

interface Props {
  open: boolean;
  onClose: () => void;
  intervention: Intervention | null;
}

export default function InterventionDetailsModal({
  open,
  onClose,
  intervention,
}: Props) {
  if (!open || !intervention) return null;

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 py-3">
      <span className="font-semibold text-slate-600">
        {label}
      </span>

      <span className="col-span-2 text-slate-800 break-words">
        {value || "-"}
      </span>
    </div>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "In Progress":
        return "bg-blue-100 text-blue-700";

      case "Planned":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-2xl font-bold">
            Intervention Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-100"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-2 p-6">

          <Row
            label="Well"
            value={intervention.well_name}
          />

          <Row
            label="Type"
            value={intervention.intervention_type}
          />

          <Row
            label="Title"
            value={intervention.title}
          />

          <Row
            label="Description"
            value={intervention.description}
          />

          <Row
            label="Service Company"
            value={intervention.company_name}
          />

          <Row
            label="Supervisor"
            value={intervention.supervisor_name}
          />

          <Row
            label="Start Date"
            value={intervention.start_date}
          />

          <Row
            label="Start Time"
            value={intervention.start_time}
          />

          <Row
            label="End Date"
            value={intervention.end_date}
          />

          <Row
            label="End Time"
            value={intervention.end_time}
          />

          <Row
            label="Status"
            value={
              <span
                className={`rounded-lg px-3 py-1 text-sm font-semibold ${getStatusColor(
                  intervention.status
                )}`}
              >
                {intervention.status}
              </span>
            }
          />

          <Row
            label="Remarks"
            value={intervention.remarks}
          />

          <Row
            label="Created"
            value={new Date(
              intervention.created_at
            ).toLocaleString()}
          />

          <Row
            label="Updated"
            value={new Date(
              intervention.updated_at
            ).toLocaleString()}
          />

        </div>

        <div className="flex justify-end border-t p-6">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}