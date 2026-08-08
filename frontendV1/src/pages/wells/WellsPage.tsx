import { useMemo, useState } from "react";

import { Plus } from "lucide-react";

import type { Well } from "../../services/well";

import { useWells } from "../../hooks/useWells";

import WellStats from "../../components/wells/WellStats";
import WellToolbar from "../../components/wells/WellToolbar";
import WellTable from "../../components/wells/WellTable";
import WellModal from "../../components/wells/WellModal";
import WellDetailsModal from "../../components/wells/WellDetailsModal";
import DeleteWellDialog from "../../components/wells/DeleteWellDialog";

export default function WellsPage() {
  const { data = [], isLoading } =
    useWells();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [selected, setSelected] =
    useState<Well | null>(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [openDetails, setOpenDetails] =
    useState(false);

  const [openDelete, setOpenDelete] =
    useState(false);

  const filtered = useMemo(() => {
    return data.filter((well) => {
      const text =
        `${well.code}
         ${well.name}
         ${well.field_name}
         ${well.operator_name}`.toLowerCase();

      const okSearch =
        text.includes(
          search.toLowerCase()
        );

      const okStatus =
        status === "All" ||
        well.status === status;

      return okSearch && okStatus;
    });
  }, [data, search, status]);

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Wells
          </h1>

          <p className="text-slate-500">
            Manage company wells
          </p>

        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Well
        </button>

      </div>

      <WellStats
        total={data.length}
        producing={
          data.filter(
            (x) =>
              x.status ===
              "Producing"
          ).length
        }
        drilling={
          data.filter(
            (x) =>
              x.status ===
              "Drilling"
          ).length
        }
        shutIn={
          data.filter(
            (x) =>
              x.status ===
              "Shut In"
          ).length
        }
        workover={
          data.filter(
            (x) =>
              x.status ===
              "Workover"
          ).length
        }
        abandoned={
          data.filter(
            (x) =>
              x.status ===
              "Abandoned"
          ).length
        }
      />

      <WellToolbar
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
      />

      <WellTable
        loading={isLoading}
        wells={filtered}
        onView={(well) => {
          setSelected(well);
          setOpenDetails(true);
        }}
        onEdit={(well) => {
          setSelected(well);
          setOpenModal(true);
        }}
        onDelete={(well) => {
          setSelected(well);
          setOpenDelete(true);
        }}
      />

      <WellModal
        open={openModal}
        well={selected}
        onClose={() =>
          setOpenModal(false)
        }
      />

      <WellDetailsModal
        open={openDetails}
        well={selected}
        onClose={() =>
          setOpenDetails(false)
        }
      />

      <DeleteWellDialog
        open={openDelete}
        wellId={selected?.id ?? null}
        onClose={() =>
          setOpenDelete(false)
        }
      />

    </div>
  );
}