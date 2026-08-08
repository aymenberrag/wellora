import { X } from "lucide-react";

import type { WellTest } from "../../types/wellTest";

interface Props {
  open: boolean;
  onClose: () => void;
  wellTest: WellTest | null;
}

export default function WellTestDetailsModal({
  open,
  onClose,
  wellTest,
}: Props) {
  if (!open || !wellTest) return null;

  const Row = ({
    label,
    value,
  }: {
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="grid grid-cols-3 gap-4 border-b border-slate-100 py-3">
      <span className="font-semibold text-slate-600">
        {label}
      </span>

      <span className="col-span-2 break-words text-slate-800">
        {value || "-"}
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-2xl font-bold">
            Well Test Details
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={22} />
          </button>

        </div>

        <div className="space-y-2 p-6">

          <Row
            label="Well"
            value={wellTest.well_name}
          />

          <Row
            label="Test Date"
            value={wellTest.test_date}
          />

          <Row
            label="Oil Rate"
            value={`${wellTest.oil_rate} BOPD`}
          />

          <Row
            label="Gas Rate"
            value={`${wellTest.gas_rate} MSCFD`}
          />

          <Row
            label="Water Rate"
            value={`${wellTest.water_rate} BWPD`}
          />

          <Row
            label="Wellhead Pressure"
            value={
              wellTest.wellhead_pressure
                ? `${wellTest.wellhead_pressure} psi`
                : "-"
            }
          />

          <Row
            label="Bottomhole Pressure"
            value={
              wellTest.bottomhole_pressure
                ? `${wellTest.bottomhole_pressure} psi`
                : "-"
            }
          />

          <Row
            label="Choke Size"
            value={
              wellTest.choke_size
                ? `${wellTest.choke_size} /64"`
                : "-"
            }
          />

          <Row
            label="Water Cut"
            value={
              wellTest.water_cut
                ? `${wellTest.water_cut}%`
                : "-"
            }
          />

          <Row
            label="GOR"
            value={
              wellTest.gor
                ? `${wellTest.gor} scf/STB`
                : "-"
            }
          />

          <Row
            label="Remarks"
            value={wellTest.remarks}
          />

          <Row
            label="Created"
            value={new Date(
              wellTest.created_at
            ).toLocaleString()}
          />

          <Row
            label="Updated"
            value={new Date(
              wellTest.updated_at
            ).toLocaleString()}
          />

        </div>

        <div className="flex justify-end border-t p-6">

          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}