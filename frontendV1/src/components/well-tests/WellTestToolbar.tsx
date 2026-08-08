import { Plus, Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
}

export default function WellTestToolbar({
  search,
  setSearch,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:w-96">

        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search well tests..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 focus:border-indigo-500 focus:outline-none"
        />

      </div>

      <button
        onClick={onAdd}
        className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700"
      >
        <Plus size={20} />
        New Well Test
      </button>

    </div>
  );
}