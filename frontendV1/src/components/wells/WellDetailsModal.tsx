import { X } from "lucide-react";

import type { Well } from "../../services/well";

interface Props {
  open: boolean;
  well: Well | null;
  onClose(): void;
}

function Item({
  label,
  value,
}: {
  label: string;
  value: string | number | boolean | null;
}) {
  return (
    <div>
      <p className="mb-1 text-sm text-slate-500">
        {label}
      </p>

      <div className="rounded-xl border bg-slate-50 p-3 font-medium">
        {value === null ||
        value === "" ||
        value === undefined
          ? "-"
          : String(value)}
      </div>
    </div>
  );
}

export default function WellDetailsModal({
  open,
  well,
  onClose,
}: Props) {
  if (!open || !well) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-8">

      <div className="mx-auto max-w-6xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">

          <div>

            <h2 className="text-2xl font-bold">
              {well.name}
            </h2>

            <p className="text-slate-500">
              {well.code}
            </p>

          </div>

          <button onClick={onClose}>
            <X />
          </button>

        </div>

        <div className="space-y-8 p-8">

          <section>

            <h3 className="mb-4 text-xl font-semibold">
              General Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <Item
                label="Code"
                value={well.code}
              />

              <Item
                label="Name"
                value={well.name}
              />

              <Item
                label="Field"
                value={well.field_name}
              />

              <Item
                label="Operator"
                value={well.operator_name}
              />

              <Item
                label="Well Type"
                value={well.well_type}
              />

              <Item
                label="Status"
                value={well.status}
              />

              <Item
                label="Artificial Lift"
                value={well.artificial_lift}
              />

              <Item
                label="Active"
                value={
                  well.is_active
                    ? "Yes"
                    : "No"
                }
              />

            </div>

          </section>

          <section>

            <h3 className="mb-4 text-xl font-semibold">
              Dates
            </h3>

            <div className="grid gap-5 md:grid-cols-3">

              <Item
                label="Spud Date"
                value={well.spud_date}
              />

              <Item
                label="Completion Date"
                value={
                  well.completion_date
                }
              />

              <Item
                label="First Production"
                value={
                  well.first_production_date
                }
              />

            </div>

          </section>

          <section>

            <h3 className="mb-4 text-xl font-semibold">
              Technical Information
            </h3>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">

              <Item
                label="Total Depth"
                value={
                  well.total_depth
                }
              />

              <Item
                label="TVD"
                value={
                  well.true_vertical_depth
                }
              />

              <Item
                label="Tubing Size"
                value={
                  well.tubing_size
                }
              />

              <Item
                label="Casing Size"
                value={
                  well.casing_size
                }
              />

            </div>

          </section>

          <section>

            <h3 className="mb-4 text-xl font-semibold">
              Reservoir
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <Item
                label="Reservoir"
                value={
                  well.reservoir
                }
              />

              <Item
                label="Formation"
                value={
                  well.formation
                }
              />

            </div>

          </section>

          <section>

            <h3 className="mb-4 text-xl font-semibold">
              Coordinates
            </h3>

            <div className="grid gap-5 md:grid-cols-2">

              <Item
                label="Latitude"
                value={
                  well.latitude
                }
              />

              <Item
                label="Longitude"
                value={
                  well.longitude
                }
              />

            </div>

          </section>

          <section>

            <h3 className="mb-4 text-xl font-semibold">
              Description
            </h3>

            <div className="rounded-xl border bg-slate-50 p-5 whitespace-pre-wrap">
              {well.description || "-"}
            </div>

          </section>

        </div>

      </div>

    </div>
  );
}