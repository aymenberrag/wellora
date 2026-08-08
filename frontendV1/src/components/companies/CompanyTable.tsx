import {
  Eye,
  Pencil,
  Trash2,
  Building2,
} from "lucide-react";

import type { Company } from "../../services/company";

import LoadingTable from "../common/LoadingTable";
import EmptyState from "../common/EmptyState";

interface Props {
  companies: Company[];
  loading: boolean;

  onView(company: Company): void;
  onEdit(company: Company): void;
  onDelete(company: Company): void;
}

const badge = (type: string) => {
  switch (type) {
    case "Oil Company":
      return "bg-green-100 text-green-700";

    case "Service Company":
      return "bg-blue-100 text-blue-700";

    case "Drilling Contractor":
      return "bg-orange-100 text-orange-700";

    case "Government":
      return "bg-purple-100 text-purple-700";

    case "Consulting":
      return "bg-cyan-100 text-cyan-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function CompanyTable({
  companies,
  loading,
  onView,
  onEdit,
  onDelete,
}: Props) {
  if (loading)
    return <LoadingTable />;

  if (!companies.length)
    return (
      <EmptyState
        title="No Companies Found"
        subtitle="Create your first company to get started."
      />
    );

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">

      <table className="w-full">

        <thead className="bg-slate-100">

          <tr>

            <th className="p-4 text-left">
              Company
            </th>

            <th className="p-4">
              Type
            </th>

            <th className="p-4">
              Country
            </th>

            <th className="p-4">
              Status
            </th>

            <th className="p-4">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {companies.map((company) => (

            <tr
              key={company.id}
              className="border-t hover:bg-slate-50"
            >

              <td className="p-4">

                <div className="flex items-center gap-4">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                    <Building2 className="text-blue-600" />
                  </div>

                  <div>

                    <h3 className="font-semibold">
                      {company.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {company.short_name}
                    </p>

                  </div>

                </div>

              </td>

              <td className="p-4">

                <span
                  className={`rounded-full px-3 py-1 text-sm ${badge(
                    company.company_type
                  )}`}
                >
                  {company.company_type}
                </span>

              </td>

              <td className="p-4">
                {company.country}
              </td>

              <td className="p-4">

                <span
                  className={`rounded-full px-3 py-1 text-sm ${
                    company.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {company.is_active
                    ? "Active"
                    : "Inactive"}
                </span>

              </td>

              <td className="p-4">

                <div className="flex justify-center gap-2">

                  <button
                    onClick={() => onView(company)}
                    className="rounded-lg p-2 hover:bg-blue-100"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() => onEdit(company)}
                    className="rounded-lg p-2 hover:bg-yellow-100"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => onDelete(company)}
                    className="rounded-lg p-2 hover:bg-red-100"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}