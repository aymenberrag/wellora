import { useState } from "react";

import { Plus } from "lucide-react";

import type { Measurement } from "../../services/measurement";

import { useMeasurements } from "../../hooks/useMeasurements";
import { unwrapList } from "../../types/pagination";

import MeasurementStats from "../../components/measurements/MeasurementStats";
import MeasurementToolbar from "../../components/measurements/MeasurementToolbar";
import MeasurementTable from "../../components/measurements/MeasurementTable";
import MeasurementModal from "../../components/measurements/MeasurementModal";
import MeasurementDetailsModal from "../../components/measurements/MeasurementDetailsModal";
import DeleteMeasurementDialog from "../../components/measurements/DeleteMeasurementDialog";
import Pagination from "../../components/common/Pagination";

export default function MeasurementsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const { data: resp, isLoading } = useMeasurements({
    page,
    page_size: pageSize,
    search: search || undefined,
    status: status !== "All" ? status : undefined,
  });

  const data: Measurement[] = unwrapList(resp);
  const total =
    resp && !Array.isArray(resp) ? resp.count : data.length;

  const [selected, setSelected] = useState<Measurement | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const filtered = data;

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
        onSearch={(v) => { setSearch(v); setPage(1); }}
        status={status}
        onStatus={(v) => { setStatus(v); setPage(1); }}
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

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        loading={isLoading}
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