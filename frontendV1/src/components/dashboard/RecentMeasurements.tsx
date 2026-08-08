import type { Measurement } from "../../services/dashboard";

interface Props {
  data: Measurement[];
}

export default function RecentMeasurements({
  data,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

      <div className="border-b border-slate-100 px-6 py-5">

        <h2 className="text-lg font-bold">
          Recent Measurements
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest well measurements
        </p>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-slate-50">

            <tr>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Well
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Field
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Status
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                WHP
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Water Cut
              </th>

              <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {data.length === 0 ? (

              <tr>

                <td
                  colSpan={6}
                  className="py-12 text-center text-slate-400"
                >
                  No measurements found.
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
                    {item.field_name}
                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.operating_status === "Running"
                          ? "bg-green-100 text-green-700"
                          : item.operating_status === "Maintenance"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.operating_status}
                    </span>

                  </td>

                  <td className="px-6 py-4 font-medium">
                    {item.wellhead_pressure ?? "-"} psi
                  </td>

                  <td className="px-6 py-4">
                    {item.water_cut ?? "-"} %
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {item.measurement_date}
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