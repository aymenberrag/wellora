interface Props {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (s: number) => void;
  loading?: boolean;
}

function range(start: number, end: number) {
  const r = [] as number[];
  for (let i = start; i <= end; i++) r.push(i);
  return r;
}

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  loading,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (total === 0) return null;

  const pagesToShow = 5;
  let start = Math.max(1, page - Math.floor(pagesToShow / 2));
  let end = start + pagesToShow - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - pagesToShow + 1);
  }

  const pages = range(start, end);

  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <button
            className="rounded-lg border px-3 py-1"
            onClick={() => onPageChange(Math.max(1, page - 1))}
            disabled={page <= 1 || loading}
          >
            Previous
          </button>

          {start > 1 && (
            <button className="rounded-lg px-3 py-1" onClick={() => onPageChange(1)}>
              1
            </button>
          )}

          {start > 2 && <span className="px-2">...</span>}

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`rounded-lg px-3 py-1 ${p === page ? 'bg-blue-600 text-white' : 'border'}`}
              disabled={loading}
            >
              {p}
            </button>
          ))}

          {end < totalPages - 1 && <span className="px-2">...</span>}

          {end < totalPages && (
            <button className="rounded-lg px-3 py-1" onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          )}

          <button
            className="rounded-lg border px-3 py-1"
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || loading}
          >
            Next
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Rows per page:</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border px-2 py-1"
          >
            {[10, 20, 50, 100].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
