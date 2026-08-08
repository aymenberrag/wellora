import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Maintenance } from "../../types/maintenance";

interface Props {
  data: Maintenance[];

  onView: (maintenance: Maintenance) => void;

  onEdit: (maintenance: Maintenance) => void;

  onDelete: (maintenance: Maintenance) => void;
}

export default function MaintenanceTable({
  data,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

      <table className="min-w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-3 text-left">
              Well
            </th>

            <th className="px-6 py-3 text-left">
              Title
            </th>

            <th className="px-6 py-3 text-left">
              Type
            </th>

            <th className="px-6 py-3 text-left">
              Status
            </th>

            <th className="px-6 py-3 text-left">
              Start Date
            </th>

            <th className="px-6 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {data.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="py-10 text-center text-slate-400"
              >
                No maintenance records found.
              </td>

            </tr>

          ) : (

            data.map((item) => (

              <tr
                key={item.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="px-6 py-4">

                  <div className="font-semibold">
                    {item.well_code}
                  </div>

                  <div className="text-sm text-slate-500">
                    {item.well_name}
                  </div>

                </td>

                <td className="px-6 py-4">
                  {item.title}
                </td>

                <td className="px-6 py-4">
                  {item.maintenance_type}
                </td>

                <td className="px-6 py-4">

                  <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {item.status}
                  </span>

                </td>

                <td className="px-6 py-4">
                  {item.start_date}
                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onView(item)}
                      className="rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(item)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
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
  );
}