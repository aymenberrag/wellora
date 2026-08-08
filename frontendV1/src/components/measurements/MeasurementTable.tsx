import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import type { Measurement } from "../../services/measurement";

interface Props {
  measurements: Measurement[];
  loading: boolean;

  onView(
    measurement: Measurement
  ): void;

  onEdit(
    measurement: Measurement
  ): void;

  onDelete(
    measurement: Measurement
  ): void;
}

export default function MeasurementTable({
  measurements,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (loading)
    return (
      <div className="rounded-2xl border bg-white p-8">
        Loading...
      </div>
    );

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Well
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Shift
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                WHP
              </th>

              <th className="p-4 text-left">
                Water Cut
              </th>

              <th className="p-4 text-left">
                Downtime
              </th>

              <th className="p-4 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {measurements.map(m => (

              <tr
                key={m.id}
                className="border-t hover:bg-slate-50"
              >

                <td className="p-4">

                  <div className="font-semibold">
                    {m.well_code}
                  </div>

                  <div className="text-sm text-slate-500">
                    {m.well_name}
                  </div>

                </td>

                <td className="p-4">
                  {m.measurement_date}
                </td>

                <td className="p-4">
                  {m.shift}
                </td>

                <td className="p-4">
                  {m.operating_status}
                </td>

                <td className="p-4">
                  {m.wellhead_pressure ?? "-"}
                </td>

                <td className="p-4">
                  {m.water_cut ?? "-"}%
                </td>

                <td className="p-4">
                  {m.downtime_hours} h
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() =>
                        onView(m)
                      }
                      className="rounded-lg bg-blue-100 p-2"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() =>
                        onEdit(m)
                      }
                      className="rounded-lg bg-yellow-100 p-2"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(m)
                      }
                      className="rounded-lg bg-red-100 p-2"
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

    </div>
  );
}