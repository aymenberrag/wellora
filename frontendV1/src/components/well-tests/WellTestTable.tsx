import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import type { WellTest } from "../../types/wellTest";

interface Props {
  data: WellTest[];

  onView: (item: WellTest) => void;

  onEdit: (item: WellTest) => void;

  onDelete: (item: WellTest) => void;
}

export default function WellTestTable({
  data,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow">

      <table className="min-w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="px-5 py-3 text-left">
              Well
            </th>

            <th className="px-5 py-3 text-left">
              Date
            </th>

            <th className="px-5 py-3 text-left">
              Oil
            </th>

            <th className="px-5 py-3 text-left">
              Gas
            </th>

            <th className="px-5 py-3 text-left">
              Water
            </th>

            <th className="px-5 py-3 text-left">
              WHP
            </th>

            <th className="px-5 py-3 text-center">
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

              <td className="px-5 py-4">
                {item.well_name}
              </td>

              <td className="px-5 py-4">
                {item.test_date}
              </td>

              <td className="px-5 py-4">
                {item.oil_rate}
              </td>

              <td className="px-5 py-4">
                {item.gas_rate}
              </td>

              <td className="px-5 py-4">
                {item.water_rate}
              </td>

              <td className="px-5 py-4">
                {item.wellhead_pressure ?? "-"}
              </td>

              <td className="px-5 py-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onView(item)}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg p-2 text-amber-600 hover:bg-amber-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(item)}
                    className="rounded-lg p-2 text-red-600 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

          {data.length === 0 && (

            <tr>

              <td
                colSpan={7}
                className="py-10 text-center text-slate-400"
              >
                No well tests found.
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
}