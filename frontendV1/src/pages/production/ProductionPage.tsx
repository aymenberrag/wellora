import { useMemo, useState } from "react";

import { useProduction } from "../../hooks/useProduction";
import { useWells } from "../../hooks/useWells";

import { useCreateProduction } from "../../hooks/useCreateProduction";
import { useUpdateProduction } from "../../hooks/useUpdateProduction";
import { useDeleteProduction } from "../../hooks/useDeleteProduction";

import type {
  Production,
  ProductionForm,
} from "../../types/production";

import ProductionStats from "../../components/production/ProductionStats";
import ProductionToolbar from "../../components/production/ProductionToolbar";
import ProductionTable from "../../components/production/ProductionTable";
import ProductionModal from "../../components/production/ProductionModal";
import ProductionDetailsModal from "../../components/production/ProductionDetailsModal";
import DeleteProductionDialog from "../../components/production/DeleteProductionDialog";

export default function ProductionPage() {

  const { data = [], isLoading } =
    useProduction();

  const { data: wells = [] } =
    useWells();

  const createMutation =
    useCreateProduction();

  const updateMutation =
    useUpdateProduction();

  const deleteMutation =
    useDeleteProduction();

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedProduction,
    setSelectedProduction] =
    useState<Production | null>(null);
  const filteredData = useMemo(() => {

    const keyword =
      search.toLowerCase();

    return data.filter((item) =>
      item.well_name
        .toLowerCase()
        .includes(keyword) ||

      item.well_code
        .toLowerCase()
        .includes(keyword)
    );

  }, [data, search]);

  function handleCreate() {

    setSelectedProduction(null);

    setModalOpen(true);

  }

  function handleEdit(
    production: Production
  ) {

    setSelectedProduction(
      production
    );

    setModalOpen(true);

  }

  function handleView(
    production: Production
  ) {

    setSelectedProduction(
      production
    );

    setDetailsOpen(true);

  }

  function handleDelete(
    production: Production
  ) {

    setSelectedProduction(
      production
    );

    setDeleteOpen(true);

  }

  async function handleSubmit(
    form: ProductionForm
  ) {

    if (selectedProduction) {

      await updateMutation.mutateAsync({
        id: selectedProduction.id,
        data: form,
      });

    } else {

      await createMutation.mutateAsync(
        form
      );

    }

    setModalOpen(false);

  }

  async function confirmDelete() {

    if (!selectedProduction) return;

    await deleteMutation.mutateAsync(
      selectedProduction.id
    );

    setDeleteOpen(false);

  }

  if (isLoading) {

    return (
      <div className="flex h-96 items-center justify-center">

        Loading...

      </div>
    );

  }
    return (
    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Production
        </h1>

        <p className="mt-1 text-slate-500">
          Manage daily production reports.
        </p>

      </div>

      <ProductionStats
        data={filteredData}
      />

      <ProductionToolbar
        search={search}
        onSearch={setSearch}
        onCreate={handleCreate}
      />

      <ProductionTable
        data={filteredData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductionModal
        open={modalOpen}
        production={selectedProduction}
        wells={wells}
        onClose={() => {
          setModalOpen(false);
          setSelectedProduction(null);
        }}
        onSubmit={handleSubmit}
      />

      <ProductionDetailsModal
        open={detailsOpen}
        production={selectedProduction}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedProduction(null);
        }}
      />

      <DeleteProductionDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedProduction(null);
        }}
        onConfirm={confirmDelete}
      />

    </div>
  );
}