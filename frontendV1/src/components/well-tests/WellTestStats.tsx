import {
  Activity,
  Droplets,
  Gauge,
  FlaskConical,
} from "lucide-react";

import StatCard from "../dashboard/StatCard";

import type { WellTest } from "../../types/wellTest";

interface Props {
  tests: WellTest[];
}

export default function WellTestStats({
  tests,
}: Props) {
  const totalTests = tests.length;

  const avgOil =
    totalTests > 0
      ? (
          tests.reduce(
            (sum, t) => sum + Number(t.oil_rate),
            0
          ) / totalTests
        ).toFixed(1)
      : "0";

  const avgGas =
    totalTests > 0
      ? (
          tests.reduce(
            (sum, t) => sum + Number(t.gas_rate),
            0
          ) / totalTests
        ).toFixed(1)
      : "0";

  const avgWaterCut =
    totalTests > 0
      ? (
          tests.reduce(
            (sum, t) =>
              sum + Number(t.water_cut ?? 0),
            0
          ) / totalTests
        ).toFixed(1)
      : "0";

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <StatCard
        title="Total Tests"
        value={totalTests}
        icon={Activity}
        color="bg-indigo-600"
      />

      <StatCard
        title="Avg Oil Rate"
        value={`${avgOil} BOPD`}
        icon={Droplets}
        color="bg-green-600"
      />

      <StatCard
        title="Avg Gas Rate"
        value={`${avgGas} MSCFD`}
        icon={Gauge}
        color="bg-blue-600"
      />

      <StatCard
        title="Avg Water Cut"
        value={`${avgWaterCut}%`}
        icon={FlaskConical}
        color="bg-cyan-600"
      />

    </div>
  );
}