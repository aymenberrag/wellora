import { RotateCcw, Search } from "lucide-react";
import { FIELD_STATUS } from "../../services/field";

interface Props {
  search: string;
  onSearch(v: string): void;

  status: string;
  onStatus(v: string): void;
}

export default function FieldToolbar({
  search,
  onSearch,
  status,
  onStatus,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-3">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) =>
              onSearch(e.target.value)
            }
            placeholder="Search field..."
            className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-blue-600"
          />

        </div>

        <select
          value={status}
          onChange={(e) =>
            onStatus(e.target.value)
          }
          className="rounded-xl border p-3"
        >
          <option>All</option>

          {FIELD_STATUS.map((item) => (
            <option key={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            onSearch("");
            onStatus("All");
          }}
          className="flex items-center justify-center gap-2 rounded-xl border hover:bg-slate-100"
        >
          <RotateCcw size={18} />

          Reset
        </button>

      </div>

    </div>
  );
}