import {
  MapPinned,
  Activity,
  Wrench,
  Ban,
} from "lucide-react";

interface Props {
  total: number;
  active: number;
  development: number;
  abandoned: number;
}

export default function FieldStats({
  total,
  active,
  development,
  abandoned,
}: Props) {
  const cards = [
    {
      title: "Total Fields",
      value: total,
      icon: MapPinned,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Active",
      value: active,
      icon: Activity,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Development",
      value: development,
      icon: Wrench,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Abandoned",
      value: abandoned,
      icon: Ban,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {card.title}
                </p>

                <h2 className="mt-3 text-4xl font-bold">
                  {card.value}
                </h2>
              </div>

              <div className={`rounded-xl p-4 ${card.color}`}>
                <Icon size={28} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}