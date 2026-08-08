import { Eye, Pencil, Trash2 } from "lucide-react";

import type { Production } from "../../types/production";

interface Props {
  data: Production[];

  onView: (production: Production) => void;

  onEdit: (production: Production) => void;

  onDelete: (production: Production) => void;
}

export default function ProductionTable({
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

            <th className="px-6 py-3 text-left">Well</th>

            <th className="px-6 py-3 text-left">Date</th>

            <th className="px-6 py-3 text-left">Oil</th>

            <th className="px-6 py-3 text-left">Gas</th>

            <th className="px-6 py-3 text-left">Water</th>

            <th className="px-6 py-3 text-left">Hours</th>

            <th className="px-6 py-3 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {data.map((item) => (

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
                {item.production_date}
              </td>

              <td className="px-6 py-4">
                {item.oil_production}
              </td>

              <td className="px-6 py-4">
                {item.gas_production}
              </td>

              <td className="px-6 py-4">
                {item.water_production}
              </td>

              <td className="px-6 py-4">
                {item.operating_hours}
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

          ))}

        </tbody>

      </table>

    </div>
  );
}