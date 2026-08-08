import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import type { Measurement } from "../../services/measurement";

import { useMeasurements } from "../../hooks/useMeasurements";

import MeasurementStats from "../../components/measurements/MeasurementStats";
import MeasurementToolbar from "../../components/measurements/MeasurementToolbar";
import MeasurementTable from "../../components/measurements/MeasurementTable";
import MeasurementModal from "../../components/measurements/MeasurementModal";
import MeasurementDetailsModal from "../../components/measurements/MeasurementDetailsModal";
import DeleteMeasurementDialog from "../../components/measurements/DeleteMeasurementDialog";

export default function MeasurementsPage() {
  const { data = [], isLoading } =
    useMeasurements();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [selected, setSelected] =
    useState<Measurement | null>(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [openDetails, setOpenDetails] =
    useState(false);

  const [openDelete, setOpenDelete] =
    useState(false);

  const filtered = useMemo(() => {
    return data.filter((m) => {
      const text =
        `${m.well_code}
         ${m.well_name}
         ${m.field_name}`.toLowerCase();

      return (
        text.includes(
          search.toLowerCase()
        ) &&
        (status === "All" ||
          m.operating_status === status)
      );
    });
  }, [data, search, status]);

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Well Measurements
          </h1>

          <p className="text-slate-500">
            Daily operating measurements
          </p>

        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          <Plus size={20} />
          New Measurement
        </button>

      </div>

      <MeasurementStats
        measurements={data}
      />

      <MeasurementToolbar
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
      />

      <MeasurementTable
        measurements={filtered}
        loading={isLoading}
        onView={(m) => {
          setSelected(m);
          setOpenDetails(true);
        }}
        onEdit={(m) => {
          setSelected(m);
          setOpenModal(true);
        }}
        onDelete={(m) => {
          setSelected(m);
          setOpenDelete(true);
        }}
      />

      <MeasurementModal
        open={openModal}
        measurement={selected}
        onClose={() =>
          setOpenModal(false)
        }
      />

      <MeasurementDetailsModal
        open={openDetails}
        measurement={selected}
        onClose={() =>
          setOpenDetails(false)
        }
      />

      <DeleteMeasurementDialog
        open={openDelete}
        measurementId={selected?.id ?? null}
        onClose={() =>
          setOpenDelete(false)
        }
      />

    </div>
  );
}