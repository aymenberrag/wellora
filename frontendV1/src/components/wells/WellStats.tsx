import {
  Droplets,
  Drill,
  PauseCircle,
  Wrench,
  Archive,
  Database,
} from "lucide-react";

interface Props {
  total: number;
  producing: number;
  drilling: number;
  shutIn: number;
  workover: number;
  abandoned: number;
}

export default function WellStats({
  total,
  producing,
  drilling,
  shutIn,
  workover,
  abandoned,
}: Props) {
  const cards = [
    {
      title: "Total Wells",
      value: total,
      icon: Database,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Producing",
      value: producing,
      icon: Droplets,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Drilling",
      value: drilling,
      icon: Drill,
      color: "bg-orange-100 text-orange-600",
    },
    {
      title: "Shut In",
      value: shutIn,
      icon: PauseCircle,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      title: "Workover",
      value: workover,
      icon: Wrench,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Abandoned",
      value: abandoned,
      icon: Archive,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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