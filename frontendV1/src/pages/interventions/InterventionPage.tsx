import { useState } from "react";

import InterventionStats from "../../components/interventions/InterventionStats";
import InterventionToolbar from "../../components/interventions/InterventionToolbar";
import InterventionTable from "../../components/interventions/InterventionTable";
import InterventionModal from "../../components/interventions/InterventionModal";
import InterventionDetailsModal from "../../components/interventions/InterventionDetailsModal";
import DeleteInterventionDialog from "../../components/interventions/DeleteInterventionDialog";
import Pagination from "../../components/common/Pagination";

import { useInterventions } from "../../hooks/useInterventions";
import { useCreateIntervention } from "../../hooks/useCreateIntervention";
import { useUpdateIntervention } from "../../hooks/useUpdateIntervention";
import { useDeleteIntervention } from "../../hooks/useDeleteIntervention";

import { useWells } from "../../hooks/useWells";
import { useCompanies } from "../../hooks/useCompanies";
import { useUsers } from "../../hooks/useUsers";
import { unwrapList } from "../../types/pagination";

import type {
  Intervention,
  InterventionForm,
} from "../../types/intervention";


export default function InterventionPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: resp,
    isLoading,
    isError,
  } = useInterventions({ page, page_size: pageSize });

  const interventions: Intervention[] = unwrapList(resp);
  const total =
    resp && !Array.isArray(resp) ? resp.count : interventions.length;

  const {
    data: wellsResp,
  } = useWells();
  const wells = unwrapList(wellsResp);


  const {
    data: companiesResp,
  } = useCompanies();
  const companies = unwrapList(companiesResp);


  const {
    data: users = [],
  } = useUsers();


  const createMutation =
    useCreateIntervention();


  const updateMutation =
    useUpdateIntervention();


  const deleteMutation =
    useDeleteIntervention();



  const [search, setSearch] = useState("");


  const [modalOpen, setModalOpen] =
    useState(false);


  const [selectedIntervention, setSelectedIntervention] =
    useState<Intervention | null>(null);


  const [detailsOpen, setDetailsOpen] =
    useState(false);


  const [deleteOpen, setDeleteOpen] =
    useState(false);



  // server-side pagination: interventions is current page
  const filteredInterventions = interventions.filter((item) =>
    `${item.title} ${item.well_name} ${item.intervention_type} ${item.status}`.toLowerCase().includes(search.toLowerCase())
  );


  const handleCreate = () => {
    setSelectedIntervention(null);
    setModalOpen(true);
  };


  const handleEdit = (
    item: Intervention
  ) => {
    setSelectedIntervention(item);
    setModalOpen(true);
  };


  const handleView = (
    item: Intervention
  ) => {
    setSelectedIntervention(item);
    setDetailsOpen(true);
  };
    const handleDelete = (
    item: Intervention
  ) => {
    setSelectedIntervention(item);
    setDeleteOpen(true);
  };

  const handleSubmit = (
    data: InterventionForm
  ) => {
    if (selectedIntervention) {
      updateMutation.mutate(
        {
          id: selectedIntervention.id,
          data,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            setSelectedIntervention(null);
          },
        }
      );
    } else {
      createMutation.mutate(
        data,
        {
          onSuccess: () => {
            setModalOpen(false);
          },
        }
      );
    }
  };

  const confirmDelete = () => {
    if (!selectedIntervention) return;

    deleteMutation.mutate(
      selectedIntervention.id,
      {
        onSuccess: () => {
          setDeleteOpen(false);
          setSelectedIntervention(null);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="mt-4 text-slate-500">
            Loading interventions...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">
            Failed to load interventions
          </h2>

          <p className="mt-2 text-slate-500">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-slate-800">
          Well Interventions
        </h1>

        <p className="text-slate-500">
          Manage all well intervention operations.
        </p>
      </div>

      <InterventionStats
        interventions={interventions}
      />

      <InterventionToolbar
        search={search}
        setSearch={(v: string) => { setSearch(v); setPage(1); }}
        onAdd={handleCreate}
      />

      <InterventionTable
        data={filteredInterventions}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={(p) => setPage(p)}
        onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        loading={isLoading}
      />

      <InterventionModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedIntervention(null);
        }}
        intervention={selectedIntervention}
        wells={wells}
        companies={companies}
        users={users}
        onSubmit={handleSubmit}
        loading={
          createMutation.isPending ||
          updateMutation.isPending
        }
      />

      <InterventionDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        intervention={selectedIntervention}
      />

      <DeleteInterventionDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />

    </div>
  );
}