import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import type {
  Well,
} from "../../services/well";

interface Props {
  wells: Well[];
  loading: boolean;

  onView(well: Well): void;
  onEdit(well: Well): void;
  onDelete(well: Well): void;
}

const statusColors: Record<
  string,
  string
> = {
  Producing:
    "bg-green-100 text-green-700",

  Drilling:
    "bg-orange-100 text-orange-700",

  "Shut In":
    "bg-yellow-100 text-yellow-700",

  Workover:
    "bg-blue-100 text-blue-700",

  Abandoned:
    "bg-red-100 text-red-700",
};

export default function WellTable({
  wells,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (loading)
    return (
      <div className="rounded-2xl bg-white p-20 text-center">
        Loading...
      </div>
    );

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-4 text-left">
              Well
            </th>

            <th className="p-4">
              Field
            </th>

            <th className="p-4">
              Type
            </th>

            <th className="p-4">
              Status
            </th>

            <th className="p-4">
              Lift
            </th>

            <th className="p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {wells.map((well) => (

            <tr
              key={well.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="p-4">

                <div>

                  <h3 className="font-semibold">
                    {well.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {well.code}
                  </p>

                </div>

              </td>

              <td className="p-4">
                {well.field_name}
              </td>

              <td className="p-4">
                {well.well_type}
              </td>

              <td className="p-4">

                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    statusColors[
                      well.status
                    ]
                  }`}
                >
                  {well.status}
                </span>

              </td>

              <td className="p-4">
                {well.artificial_lift ??
                  "-"}
              </td>

              <td className="p-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() =>
                      onView(well)
                    }
                    className="rounded-lg p-2 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() =>
                      onEdit(well)
                    }
                    className="rounded-lg p-2 hover:bg-yellow-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      onDelete(well)
                    }
                    className="rounded-lg p-2 hover:bg-red-100"
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