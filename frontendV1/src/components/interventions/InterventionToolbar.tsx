import { Plus, Search } from "lucide-react";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  onAdd: () => void;
}

export default function InterventionToolbar({
  search,
  setSearch,
  onAdd,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:w-96">
        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Search interventions..."
          className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 outline-none focus:border-indigo-500"
        />
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700"
      >
        <Plus size={18} />
        New Intervention
      </button>
    </div>
  );
}