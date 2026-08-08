import { useMemo, useState } from "react";

import { MapPinned, Plus } from "lucide-react";

import type { Field } from "../../services/field";

import { useFields } from "../../hooks/useFields";

import FieldStats from "../../components/fields/FieldStats";
import FieldToolbar from "../../components/fields/FieldToolbar";
import FieldTable from "../../components/fields/FieldTable";
import FieldModal from "../../components/fields/FieldModal";
import FieldDetailsModal from "../../components/fields/FieldDetailsModal";
import DeleteFieldDialog from "../../components/fields/DeleteFieldDialog";

export default function FieldsPage() {
  const { data = [], isLoading } =
    useFields();

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [selected, setSelected] =
    useState<Field | null>(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [openDetails, setOpenDetails] =
    useState(false);

  const [openDelete, setOpenDelete] =
    useState(false);

  const filtered = useMemo(() => {
    return data.filter((field) => {
      const text = `${field.name}
      ${field.code}
      ${field.country}
      ${field.city}`.toLowerCase();

      const okSearch =
        text.includes(
          search.toLowerCase()
        );

      const okStatus =
        status === "All" ||
        field.status === status;

      return okSearch && okStatus;
    });
  }, [data, search, status]);

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-4xl font-bold">
            Fields
          </h1>

          <p className="text-slate-500">
            Manage oil & gas fields
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
          Add Field
        </button>

      </div>

      <FieldStats
        total={data.length}
        active={
          data.filter(
            (x) => x.status === "Active"
          ).length
        }
        development={
          data.filter(
            (x) =>
              x.status ===
              "Development"
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

      <FieldToolbar
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
      />

      <FieldTable
        loading={isLoading}
        fields={filtered}
        onView={(field) => {
          setSelected(field);
          setOpenDetails(true);
        }}
        onEdit={(field) => {
          setSelected(field);
          setOpenModal(true);
        }}
        onDelete={(field) => {
          setSelected(field);
          setOpenDelete(true);
        }}
      />

      <FieldModal
        open={openModal}
        field={selected}
        onClose={() =>
          setOpenModal(false)
        }
      />

      <FieldDetailsModal
        open={openDetails}
        field={selected}
        onClose={() =>
          setOpenDetails(false)
        }
      />

      <DeleteFieldDialog
        open={openDelete}
        fieldId={selected?.id ?? null}
        onClose={() =>
          setOpenDelete(false)
        }
      />

    </div>
  );
}