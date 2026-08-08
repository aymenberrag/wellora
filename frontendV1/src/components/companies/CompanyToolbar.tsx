import { Search, RotateCcw } from "lucide-react";

const COMPANY_TYPES = [
  "All",
  "Oil Company",
  "Service Company",
  "Drilling Contractor",
  "Government",
  "Consulting",
  "Other",
];

interface Props {
  search: string;
  onSearch: (v: string) => void;

  type: string;
  onType: (v: string) => void;

  status: string;
  onStatus: (v: string) => void;
}

export default function CompanyToolbar({
  search,
  onSearch,
  type,
  onType,
  status,
  onStatus,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">

      <div className="grid gap-4 lg:grid-cols-4">

        <div className="relative">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search companies..."
            className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-blue-600"
          />

        </div>

        <select
          value={type}
          onChange={(e) => onType(e.target.value)}
          className="rounded-xl border p-3 outline-none focus:border-blue-600"
        >
          {COMPANY_TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="rounded-xl border p-3 outline-none focus:border-blue-600"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <button
          onClick={() => {
            onSearch("");
            onType("All");
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