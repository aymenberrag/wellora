import {
  Building2,
  Factory,
  Briefcase,
  Activity,
} from "lucide-react";

interface Props {
  total: number;
  active: number;
  service: number;
  oil: number;
}

const cards = [
  {
    title: "Companies",
    key: "total",
    icon: Building2,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Oil Companies",
    key: "oil",
    icon: Factory,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Service Companies",
    key: "service",
    icon: Briefcase,
    color: "bg-orange-100 text-orange-600",
  },
  {
    title: "Active",
    key: "active",
    icon: Activity,
    color: "bg-purple-100 text-purple-600",
  },
];

export default function CompanyStats(props: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

      {cards.map((card) => {
        const Icon = card.icon;

        const value =
          props[
            card.key as keyof Props
          ];

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  {value}
                </h2>

              </div>

              <div
                className={`rounded-xl p-4 ${card.color}`}
              >
                <Icon size={28} />
              </div>

            </div>
          </div>
        );
      })}

    </div>
  );
}