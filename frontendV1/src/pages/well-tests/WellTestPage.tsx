import { useState } from "react";

import WellTestStats from "../../components/well-tests/WellTestStats";
import WellTestToolbar from "../../components/well-tests/WellTestToolbar";
import WellTestTable from "../../components/well-tests/WellTestTable";
import WellTestModal from "../../components/well-tests/WellTestModal";
import WellTestDetailsModal from "../../components/well-tests/WellTestDetailsModal";
import DeleteWellTestDialog from "../../components/well-tests/DeleteWellTestDialog";
import Pagination from "../../components/common/Pagination";

import { useWellTests } from "../../hooks/useWellTests";
import { useCreateWellTest } from "../../hooks/useCreateWellTest";
import { useUpdateWellTest } from "../../hooks/useUpdateWellTest";
import { useDeleteWellTest } from "../../hooks/useDeleteWellTest";
import { useWells } from "../../hooks/useWells";

import type {
  WellTest,
  WellTestForm,
} from "../../types/wellTest";

export default function WellTestPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const {
    data: resp,
    isLoading,
    isError,
  } = useWellTests({ page, page_size: pageSize });

  const tests = resp?.results ?? resp ?? [];
  const total = resp?.count ?? tests.length;

  const {
    data: wells = [],
  } = useWells();

  const createMutation =
    useCreateWellTest();

  const updateMutation =
    useUpdateWellTest();

  const deleteMutation =
    useDeleteWellTest();

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] =
    useState(false);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedTest, setSelectedTest] =
    useState<WellTest | null>(null);

  // server-side pagination: tests is current page
  const filteredTests = tests.filter((item) =>
    `${item.well_name} ${item.test_date} ${item.oil_rate} ${item.gas_rate}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedTest(null);
    setModalOpen(true);
  };

  const handleEdit = (
    test: WellTest
  ) => {
    setSelectedTest(test);
    setModalOpen(true);
  };

  const handleView = (
    test: WellTest
  ) => {
    setSelectedTest(test);
    setDetailsOpen(true);
  };

  const handleDelete = (
    test: WellTest
  ) => {
    setSelectedTest(test);
    setDeleteOpen(true);
  };
    const handleSubmit = (
    data: WellTestForm
  ) => {
    if (selectedTest) {
      updateMutation.mutate(
        {
          id: selectedTest.id,
          data,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            setSelectedTest(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    }
  };

  const confirmDelete = () => {
    if (!selectedTest) return;

    deleteMutation.mutate(selectedTest.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedTest(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />

          <p className="mt-4 text-slate-500">
            Loading well tests...
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
            Failed to load well tests
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

      <div>

        <h1 className="text-4xl font-bold text-slate-800">
          Well Tests
        </h1>

        <p className="mt-2 text-slate-500">
          Monitor and manage all well test results.
        </p>

      </div>

      <WellTestStats tests={tests} />

      <WellTestToolbar
        search={search}
        setSearch={(v: string) => { setSearch(v); setPage(1); }}
        onAdd={handleCreate}
      />

      <WellTestTable
        data={filteredTests}
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

      <WellTestModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTest(null);
        }}
        wellTest={selectedTest}
        wells={wells}
        onSubmit={handleSubmit}
        loading={
          createMutation.isPending ||
          updateMutation.isPending
        }
      />

      <WellTestDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        wellTest={selectedTest}
      />

      <DeleteWellTestDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
      />

    </div>
  );
}