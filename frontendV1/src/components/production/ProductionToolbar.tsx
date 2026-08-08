import { Search, Plus } from "lucide-react";

interface Props {
  search: string;
  onSearch: (value: string) => void;
  onCreate: () => void;
}

export default function ProductionToolbar({
  search,
  onSearch,
  onCreate,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:flex-row md:items-center md:justify-between">

      <div className="relative w-full md:w-96">

        <Search
          className="absolute left-3 top-3 text-slate-400"
          size={18}
        />

        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by well..."
          className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
        />

      </div>

      <button
        onClick={onCreate}
        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
      >
        <Plus size={18} />
        New Production
      </button>

    </div>
  );
}