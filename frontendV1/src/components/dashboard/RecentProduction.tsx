interface Production {
  id: number;
  well: string;
  production_date: string;
  oil_production: number;
}

interface Props {
  data: Production[];
}

export default function RecentProduction({ data }: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Production
        </h2>

        <p className="text-sm text-slate-500">
          Latest production records
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {data.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No production data found.
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
                  {item.production_date}
                </p>
              </div>

              <div className="rounded-xl bg-amber-100 px-4 py-2 font-semibold text-amber-700">
                {item.oil_production} bbl
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}