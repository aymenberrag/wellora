export default function LoadingTable() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-6 border-b p-6"
        >
          <div className="h-12 w-12 animate-pulse rounded-xl bg-slate-200" />

          <div className="flex-1">

            <div className="mb-2 h-5 w-48 animate-pulse rounded bg-slate-200" />

            <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />

          </div>

          <div className="h-9 w-28 animate-pulse rounded-full bg-slate-200" />

          <div className="h-9 w-32 animate-pulse rounded bg-slate-100" />
        </div>
      ))}

    </div>
  );
}