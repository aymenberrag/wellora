import {
  Eye,
  Pencil,
  Trash2,
  MapPinned,
} from "lucide-react";

import type { Field } from "../../services/field";

interface Props {
  fields: Field[];
  loading: boolean;

  onView(field: Field): void;
  onEdit(field: Field): void;
  onDelete(field: Field): void;
}

const colors: Record<string, string> = {
  Active:
    "bg-green-100 text-green-700",

  Development:
    "bg-orange-100 text-orange-700",

  Inactive:
    "bg-slate-100 text-slate-700",

  Abandoned:
    "bg-red-100 text-red-700",
};

export default function FieldTable({
  fields,
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
              Field
            </th>

            <th className="p-4">
              Status
            </th>

            <th className="p-4">
              Country
            </th>

            <th className="p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {fields.map((field) => (

            <tr
              key={field.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="p-4">

                <div className="flex items-center gap-4">

                  <div className="rounded-xl bg-blue-100 p-3">

                    <MapPinned className="text-blue-600" />

                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {field.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {field.code}
                    </p>

                  </div>

                </div>

              </td>

              <td className="p-4">

                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    colors[field.status]
                  }`}
                >
                  {field.status}
                </span>

              </td>

              <td className="p-4">
                {field.country}
              </td>

              <td className="p-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() =>
                      onView(field)
                    }
                    className="rounded-lg p-2 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() =>
                      onEdit(field)
                    }
                    className="rounded-lg p-2 hover:bg-yellow-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() =>
                      onDelete(field)
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