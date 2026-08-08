import type { Maintenance } from "../../types/maintenance";

interface Props {
  data: Maintenance[];
}

export default function MaintenanceStats({
  data,
}: Props) {
  const planned = data.filter(
    (m) => m.status === "Planned"
  ).length;

  const progress = data.filter(
    (m) => m.status === "In Progress"
  ).length;

  const completed = data.filter(
    (m) => m.status === "Completed"
  ).length;

  const cost = data.reduce(
    (sum, m) => sum + Number(m.actual_cost ?? 0),
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-4">

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Planned
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {planned}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          In Progress
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {progress}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Completed
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          {completed}
        </h2>
      </div>

      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm text-slate-500">
          Total Cost
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          ${cost.toLocaleString()}
        </h2>
      </div>

    </div>
  );
}