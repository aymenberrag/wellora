import { useMemo, useState } from "react";
import { Building2, Plus } from "lucide-react";

import { useCompanies } from "../../hooks/useCompanies";
import type { Company } from "../../services/company";

import CompanyToolbar from "../../components/companies/CompanyToolbar";
import CompanyTable from "../../components/companies/CompanyTable";
import CompanyModal from "../../components/companies/CompanyModal";
import CompanyDetailsModal from "../../components/companies/CompanyDetailsModal";
import DeleteCompanyDialog from "../../components/companies/DeleteCompanyDialog";

export default function CompaniesPage() {
  const { data = [], isLoading } = useCompanies();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  const [selected, setSelected] = useState<Company | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const filtered = useMemo(() => {
    return data.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.short_name.toLowerCase().includes(search.toLowerCase()) ||
        company.country.toLowerCase().includes(search.toLowerCase()) ||
        company.city.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === "All" || company.company_type === type;

      const matchesStatus =
        status === "All" ||
        (status === "Active" && company.is_active) ||
        (status === "Inactive" && !company.is_active);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, search, type, status]);

  const stats = {
    total: data.length,
    active: data.filter((c) => c.is_active).length,
    service: data.filter(
      (c) => c.company_type === "Service Company"
    ).length,
    operators: data.filter(
      (c) => c.company_type === "Oil Company"
    ).length,
  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Companies
          </h1>

          <p className="mt-2 text-slate-500">
            Manage all companies in Wellora.
          </p>

        </div>

        <button
          onClick={() => {
            setSelected(null);
            setOpenModal(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white shadow transition hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Company
        </button>

      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Companies"
          value={stats.total}
        />

        <StatCard
          title="Active"
          value={stats.active}
        />

        <StatCard
          title="Service Companies"
          value={stats.service}
        />

        <StatCard
          title="Oil Companies"
          value={stats.operators}
        />

      </div>

      <CompanyToolbar
        search={search}
        onSearch={setSearch}
        type={type}
        onType={setType}
        status={status}
        onStatus={setStatus}
      />

      <CompanyTable
        companies={filtered}
        loading={isLoading}
        onView={(company) => {
          setSelected(company);
          setOpenDetails(true);
        }}
        onEdit={(company) => {
          setSelected(company);
          setOpenModal(true);
        }}
        onDelete={(company) => {
          setSelected(company);
          setOpenDelete(true);
        }}
      />

      <CompanyModal
        open={openModal}
        company={selected}
        onClose={() => setOpenModal(false)}
      />

      <CompanyDetailsModal
        open={openDetails}
        company={selected}
        onClose={() => setOpenDetails(false)}
      />

      <DeleteCompanyDialog
        open={openDelete}
        companyId={selected?.id ?? null}
        onClose={() => setOpenDelete(false)}
      />

    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-800">
            {value}
          </h2>

        </div>

        <div className="rounded-xl bg-blue-100 p-4">
          <Building2 className="text-blue-600" />
        </div>

      </div>

    </div>
  );
}