import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface Props {
  active: number;
  shutIn: number;
}

export default function WellStatusChart({
  active,
  shutIn,
}: Props) {
  const data = [
    {
      name: "Running",
      value: active,
      color: "#16a34a",
    },
    {
      name: "Maintenance",
      value: shutIn,
      color: "#ef4444",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Well Status
        </h2>

        <p className="text-sm text-slate-500">
          Active vs Shut-In Wells
        </p>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={75}
              outerRadius={120}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.color}
                />
              ))}
            </Pie>

            <Tooltip />

            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-green-50 p-4 text-center">
          <p className="text-sm text-slate-500">
            Active
          </p>

          <h3 className="mt-2 text-3xl font-bold text-green-600">
            {active}
          </h3>
        </div>

        <div className="rounded-xl bg-red-50 p-4 text-center">
          <p className="text-sm text-slate-500">
            Shut-In
          </p>

          <h3 className="mt-2 text-3xl font-bold text-red-600">
            {shutIn}
          </h3>
        </div>
      </div>
    </div>
  );
}