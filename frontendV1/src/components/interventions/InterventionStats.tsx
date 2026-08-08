import {
  Wrench,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";

import StatCard from "../dashboard/StatCard";

import type { Intervention } from "../../types/intervention";

interface Props {
  interventions: Intervention[];
}

export default function InterventionStats({
  interventions,
}: Props) {
  const total = interventions.length;

  const planned = interventions.filter(
    (i) => i.status === "Planned"
  ).length;

  const inProgress = interventions.filter(
    (i) => i.status === "In Progress"
  ).length;

  const completed = interventions.filter(
    (i) => i.status === "Completed"
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Interventions"
        value={total}
        icon={Wrench}
        color="bg-indigo-600"
      />

      <StatCard
        title="Planned"
        value={planned}
        icon={Calendar}
        color="bg-yellow-500"
      />

      <StatCard
        title="In Progress"
        value={inProgress}
        icon={Clock}
        color="bg-blue-600"
      />

      <StatCard
        title="Completed"
        value={completed}
        icon={CheckCircle}
        color="bg-green-600"
      />
    </div>
  );
}