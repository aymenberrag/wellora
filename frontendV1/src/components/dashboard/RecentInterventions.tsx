interface Intervention {
  id: number;
  well: string;
  intervention_type: string;
  status: string;
}

interface Props {
  data: Intervention[];
}

const statusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-700";

    case "in progress":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function RecentInterventions({ data }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Interventions
        </h2>

        <p className="text-sm text-slate-500">
          Latest intervention jobs
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {data.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No interventions found.
          </div>
        ) : (
          data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-50"
            >
              <div>
                <h3 className="font-semibold text-slate-700">
                  {item.well}
                </h3>

                <p className="text-sm text-slate-500">
                  {item.intervention_type}
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${statusColor(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}