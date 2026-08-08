import { Plus, Search } from "lucide-react";

interface Props {
  search: string;
  onSearch: (value: string) => void;
  onCreate: () => void;
}

export default function MaintenanceToolbar({
  search,
  onSearch,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:w-96">

        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) =>
            onSearch(e.target.value)
          }
          placeholder="Search maintenance..."
          className="w-full rounded-xl border py-2.5 pl-10 pr-4"
        />

      </div>

      <button
        onClick={onCreate}
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
      >
        <Plus size={18} />
        New Maintenance
      </button>

    </div>
  );
}