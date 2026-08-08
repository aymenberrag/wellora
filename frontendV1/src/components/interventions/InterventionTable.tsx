import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Intervention } from "../../types/intervention";

interface Props {
  data: Intervention[];

  onView: (item: Intervention) => void;

  onEdit: (item: Intervention) => void;

  onDelete: (item: Intervention) => void;
}

export default function InterventionTable({
  data,
  onView,
  onEdit,
  onDelete,
}: Props) {
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
    <div className="overflow-hidden rounded-2xl bg-white shadow">
      <div className="border-b px-6 py-5">
        <h2 className="text-lg font-semibold">
          Well Interventions
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Well
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Type
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Title
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Supervisor
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Start
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
                Status
              </th>

              <th className="px-6 py-3 text-center text-xs font-semibold uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-slate-400"
                >
                  No interventions found.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="border-t transition hover:bg-slate-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {item.well_name}
                  </td>

                  <td className="px-6 py-4">
                    {item.intervention_type}
                  </td>

                  <td className="px-6 py-4">
                    {item.title}
                  </td>

                  <td className="px-6 py-4">
                    {item.supervisor_name || "-"}
                  </td>

                  <td className="px-6 py-4">
                    {item.start_date}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-lg px-3 py-1 text-sm font-semibold ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onView(item)}
                        className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg bg-yellow-100 p-2 text-yellow-700 transition hover:bg-yellow-200"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(item)}
                        className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}