import type { Company } from "../../services/company";
import { Building2, MapPin, Mail, Phone } from "lucide-react";

interface Props {
  company: Company;
  onView?: (company: Company) => void;
  onEdit?: (company: Company) => void;
}

export default function CompanyCard({
  company,
  onView,
  onEdit,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      <div className="mb-5 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-blue-100 p-3">
            <Building2 className="text-blue-600" />
          </div>

          <div>

            <h3 className="font-semibold text-slate-800">
              {company.name}
            </h3>

            <p className="text-sm text-slate-500">
              {company.short_name}
            </p>

          </div>

        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            company.is_active
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {company.is_active ? "Active" : "Inactive"}
        </span>

      </div>

      <div className="space-y-3 text-sm">

        <div className="flex items-center gap-2 text-slate-600">
          <MapPin size={16} />
          {company.city}, {company.country}
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Mail size={16} />
          {company.email}
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Phone size={16} />
          {company.phone}
        </div>

      </div>

      <div className="mt-6 flex gap-3">

        <button
          onClick={() => onView?.(company)}
          className="flex-1 rounded-xl border py-2 transition hover:bg-slate-100"
        >
          View
        </button>

        <button
          onClick={() => onEdit?.(company)}
          className="flex-1 rounded-xl bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          Edit
        </button>

      </div>

    </div>
  );
}