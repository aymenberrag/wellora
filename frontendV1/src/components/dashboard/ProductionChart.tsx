import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

interface ProductionPoint {
  date: string;
  oil: number;
  gas: number;
  water: number;
}

interface Props {
  data: ProductionPoint[];
}

const sampleData: ProductionPoint[] = [
  { date: "Mon", oil: 1200, gas: 800, water: 300 },
  { date: "Tue", oil: 1350, gas: 900, water: 320 },
  { date: "Wed", oil: 1280, gas: 860, water: 340 },
  { date: "Thu", oil: 1420, gas: 950, water: 360 },
  { date: "Fri", oil: 1500, gas: 980, water: 390 },
  { date: "Sat", oil: 1470, gas: 960, water: 380 },
  { date: "Sun", oil: 1550, gas: 1020, water: 410 },
];

export default function ProductionChart({ data }: Props) {
  const chartData = data.length ? data : sampleData;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800">
          Production Trend
        </h2>

        <p className="text-sm text-slate-500">
          Oil, Gas and Water Production
        </p>
      </div>

      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="date" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Line
              type="monotone"
              dataKey="oil"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="gas"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="water"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}