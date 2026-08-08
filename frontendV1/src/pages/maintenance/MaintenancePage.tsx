import { useMemo, useState } from "react";

import { useMaintenance } from "../../hooks/useMaintenance";
import { useCreateMaintenance } from "../../hooks/useCreateMaintenance";
import { useUpdateMaintenance } from "../../hooks/useUpdateMaintenance";
import { useDeleteMaintenance } from "../../hooks/useDeleteMaintenance";

import { useWells } from "../../hooks/useWells";
import { useCompanies } from "../../hooks/useCompanies";
import { useUsers } from "../../hooks/useUsers";

import type {
  Maintenance,
  MaintenanceForm,
} from "../../types/maintenance";

import MaintenanceStats from "../../components/maintenance/MaintenanceStats";
import MaintenanceToolbar from "../../components/maintenance/MaintenanceToolbar";
import MaintenanceTable from "../../components/maintenance/MaintenanceTable";
import MaintenanceModal from "../../components/maintenance/MaintenanceModal";
import MaintenanceDetailsModal from "../../components/maintenance/MaintenanceDetailsModal";
import DeleteMaintenanceDialog from "../../components/maintenance/DeleteMaintenanceDialog";

export default function MaintenancePage() {
  const { data = [], isLoading } =
    useMaintenance();

  const { data: wells = [] } =
    useWells();

  const { data: companies = [] } =
    useCompanies();

  const { data: users = [] } =
    useUsers();

  const createMutation =
    useCreateMaintenance();

  const updateMutation =
    useUpdateMaintenance();

  const deleteMutation =
    useDeleteMaintenance();

  const [search, setSearch] =
    useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedMaintenance,
    setSelectedMaintenance] =
    useState<Maintenance | null>(null);
      const filteredData = useMemo(() => {
    const keyword =
      search.toLowerCase();

    return data.filter((item) =>
      item.title
        .toLowerCase()
        .includes(keyword) ||

      item.well_name
        .toLowerCase()
        .includes(keyword) ||

      item.well_code
        .toLowerCase()
        .includes(keyword)
    );
  }, [data, search]);

  function handleCreate() {
    setSelectedMaintenance(null);
    setModalOpen(true);
  }

  function handleEdit(
    maintenance: Maintenance
  ) {
    setSelectedMaintenance(
      maintenance
    );
    setModalOpen(true);
  }

  function handleView(
    maintenance: Maintenance
  ) {
    setSelectedMaintenance(
      maintenance
    );
    setDetailsOpen(true);
  }

  function handleDelete(
    maintenance: Maintenance
  ) {
    setSelectedMaintenance(
      maintenance
    );
    setDeleteOpen(true);
  }

  async function handleSubmit(
    form: MaintenanceForm
  ) {
    if (selectedMaintenance) {
      await updateMutation.mutateAsync({
        id: selectedMaintenance.id,
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
    if (!selectedMaintenance)
      return;

    await deleteMutation.mutateAsync(
      selectedMaintenance.id
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
          Maintenance
        </h1>

        <p className="mt-1 text-slate-500">
          Manage well maintenance activities.
        </p>

      </div>

      <MaintenanceStats
        data={filteredData}
      />

      <MaintenanceToolbar
        search={search}
        onSearch={setSearch}
        onCreate={handleCreate}
      />

      <MaintenanceTable
        data={filteredData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <MaintenanceModal
        open={modalOpen}
        maintenance={selectedMaintenance}
        wells={wells}
        companies={companies}
        users={users}
        onClose={() => {
          setModalOpen(false);
          setSelectedMaintenance(null);
        }}
        onSubmit={handleSubmit}
      />

      <MaintenanceDetailsModal
        open={detailsOpen}
        maintenance={selectedMaintenance}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedMaintenance(null);
        }}
      />

      <DeleteMaintenanceDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedMaintenance(null);
        }}
        onConfirm={confirmDelete}
      />

    </div>
  );
}