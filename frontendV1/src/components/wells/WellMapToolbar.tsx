import { RotateCcw, Search } from "lucide-react";

import {
  WELL_STATUS,
  WELL_TYPES,
  ARTIFICIAL_LIFTS,
} from "../../services/well";
import type { Field } from "../../services/field";

interface Props {
  search: string;
  onSearch(v: string): void;

  fieldId: string;
  onField(v: string): void;
  fields: Field[];

  status: string;
  onStatus(v: string): void;

  wellType: string;
  onWellType(v: string): void;

  artificialLift: string;
  onArtificialLift(v: string): void;

  onReset(): void;
}

export default function WellMapToolbar({
  search,
  onSearch,
  fieldId,
  onField,
  fields,
  status,
  onStatus,
  wellType,
  onWellType,
  artificialLift,
  onArtificialLift,
  onReset,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <div className="relative xl:col-span-2">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search wells..."
            className="w-full rounded-xl border py-3 pl-11 pr-4 outline-none focus:border-blue-600"
          />
        </div>

        <select
          value={fieldId}
          onChange={(e) => onField(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="All">All Fields</option>
          {fields.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatus(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option>All</option>
          {WELL_STATUS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={wellType}
          onChange={(e) => onWellType(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option>All</option>
          {WELL_TYPES.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <select
          value={artificialLift}
          onChange={(e) => onArtificialLift(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option>All</option>
          {ARTIFICIAL_LIFTS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>

      <button
        onClick={onReset}
        className="mt-4 flex items-center gap-2 rounded-xl border px-4 py-2 text-sm hover:bg-slate-100"
      >
        <RotateCcw size={16} />
        Reset filters
      </button>
    </div>
  );
}
