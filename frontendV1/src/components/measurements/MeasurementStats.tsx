import {
  Activity,
  Gauge,
  Droplets,
  AlertTriangle,
} from "lucide-react";

import type { Measurement } from "../../services/measurement";

interface Props {
  measurements: Measurement[];
}

function Card({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {value}
          </h2>

        </div>

        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={28} className="text-white" />
        </div>

      </div>

    </div>
  );
}

export default function MeasurementStats({
  measurements,
}: Props) {
  const running = measurements.filter(
    m => m.operating_status === "Running"
  ).length;

  const avgPressure =
    measurements.length === 0
      ? 0
      : (
          measurements.reduce(
            (sum, m) =>
              sum +
              Number(
                m.wellhead_pressure ?? 0
              ),
            0
          ) / measurements.length
        ).toFixed(1);

  const avgWaterCut =
    measurements.length === 0
      ? 0
      : (
          measurements.reduce(
            (sum, m) =>
              sum +
              Number(
                m.water_cut ?? 0
              ),
            0
          ) / measurements.length
        ).toFixed(1);

  const downtime = measurements.filter(
    m => Number(m.downtime_hours) > 0
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <Card
        title="Measurements"
        value={measurements.length}
        icon={Activity}
        color="bg-blue-600"
      />

      <Card
        title="Running Wells"
        value={running}
        icon={Gauge}
        color="bg-green-600"
      />

      <Card
        title="Average Water Cut"
        value={`${avgWaterCut}%`}
        icon={Droplets}
        color="bg-cyan-600"
      />

      <Card
        title="Downtime Events"
        value={downtime}
        icon={AlertTriangle}
        color="bg-red-600"
      />

    </div>
  );
}