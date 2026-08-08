import {
  Building2,
  Map,
  Droplets,
  CheckCircle2,
  CircleOff,
  Fuel,
  Flame,
  Waves,
  Wrench,
  ShieldAlert,
} from "lucide-react";

import StatCard from "./StatCard";
import type { DashboardData } from "../../services/dashboard";

interface Props {
  data: DashboardData;
}

export default function DashboardStats({ data }: Props) {
  const stats = [
    {
      title: "Companies",
      value: data.total_companies,
      icon: Building2,
      color: "bg-blue-600",
      subtitle: "Registered companies",
    },
    {
      title: "Fields",
      value: data.total_fields,
      icon: Map,
      color: "bg-emerald-600",
      subtitle: "Active fields",
    },
    {
      title: "Wells",
      value: data.total_wells,
      icon: Droplets,
      color: "bg-cyan-600",
      subtitle: "Total wells",
    },
    {
      title: "Running Wells",
      value: data.running_wells,
      icon: CheckCircle2,
      color: "bg-green-600",
      subtitle: "Currently producing",
    },
    {
      title: "Maintenance Wells",
      value: data.maintenance_wells,
      icon: CircleOff,
      color: "bg-red-600",
      subtitle: "In maintenance",
    },
    {
      title: "Oil Today",
      value: Number(data.today_oil).toLocaleString(),
      icon: Fuel,
      color: "bg-amber-600",
      subtitle: "Barrels",
    },
    {
      title: "Gas Today",
      value: Number(data.today_gas).toLocaleString(),
      icon: Flame,
      color: "bg-orange-600",
      subtitle: "m³",
    },
    {
      title: "Water Today",
      value: Number(data.today_water).toLocaleString(),
      icon: Waves,
      color: "bg-sky-600",
      subtitle: "Barrels",
    },
    {
      title: "Maintenance",
      value: data.ongoing_maintenance,
      icon: Wrench,
      color: "bg-violet-600",
      subtitle: "In Progress",
    },
    {
      title: "Interventions",
      value: data.ongoing_interventions,
      icon: ShieldAlert,
      color: "bg-rose-600",
      subtitle: "In Progress",
    },
  ];

  return (
    <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          subtitle={stat.subtitle}
        />
      ))}
    </section>
  );
}