import { Building2 } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
}

export default function EmptyState({
  title,
  subtitle,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-20 text-center">

      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

        <Building2
          size={36}
          className="text-blue-600"
        />

      </div>

      <h2 className="mt-6 text-2xl font-bold">
        {title}
      </h2>

      <p className="mt-2 text-slate-500">
        {subtitle}
      </p>

    </div>
  );
}