import { X, Building2, Mail, Phone, MapPin, Globe } from "lucide-react";
import type { Company } from "../../services/company";

interface Props {
  open: boolean;
  onClose: () => void;
  company: Company | null;
}

export default function CompanyDetailsModal({
  open,
  onClose,
  company,
}: Props) {
  if (!open || !company) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold">
              {company.name}
            </h2>

            <p className="text-slate-500">
              Company Details
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">

          <Info
            icon={<Building2 size={20} />}
            label="Short Name"
            value={company.short_name}
          />

          <Info
            icon={<Globe size={20} />}
            label="Type"
            value={company.company_type}
          />

          <Info
            icon={<MapPin size={20} />}
            label="Country"
            value={company.country}
          />

          <Info
            icon={<MapPin size={20} />}
            label="City"
            value={company.city}
          />

          <Info
            icon={<Mail size={20} />}
            label="Email"
            value={company.email}
          />

          <Info
            icon={<Phone size={20} />}
            label="Phone"
            value={company.phone}
          />

          <div className="rounded-xl border p-4">
            <p className="text-sm text-slate-500">
              Status
            </p>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm ${
                company.is_active
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {company.is_active ? "Active" : "Inactive"}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

interface InfoProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Info({
  icon,
  label,
  value,
}: InfoProps) {
  return (
    <div className="rounded-xl border p-4">
      <div className="mb-3 flex items-center gap-2 text-blue-600">
        {icon}

        <span className="text-sm font-semibold">
          {label}
        </span>
      </div>

      <p className="text-slate-700">
        {value || "-"}
      </p>
    </div>
  );
}