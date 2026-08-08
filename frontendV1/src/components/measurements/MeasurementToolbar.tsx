import { Search } from "lucide-react";

import { OPERATING_STATUS } from "../../services/measurement";

interface Props {
  search: string;
  status: string;
  onSearch(value: string): void;
  onStatus(value: string): void;
}

export default function MeasurementToolbar({
  search,
  status,
  onSearch,
  onStatus,
}: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-white p-6 shadow-sm lg:flex-row">

      <div className="relative flex-1">

        <Search
          size={18}
          className="absolute left-3 top-3 text-slate-400"
        />

        <input
          value={search}
          onChange={e =>
            onSearch(e.target.value)
          }
          placeholder="Search well..."
          className="w-full rounded-xl border py-3 pl-10 pr-4"
        />

      </div>

      <select
        value={status}
        onChange={e =>
          onStatus(e.target.value)
        }
        className="rounded-xl border px-4"
      >

        <option>All</option>

        {OPERATING_STATUS.map(s => (
          <option
            key={s}
            value={s}
          >
            {s}
          </option>
        ))}

      </select>

    </div>
  );
}