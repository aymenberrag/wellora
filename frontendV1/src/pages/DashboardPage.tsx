import { useDashboard } from "../hooks/useDashboard";

import DashboardStats from "../components/dashboard/DashboardStats";
import ProductionChart from "../components/dashboard/ProductionChart";
import WellStatusChart from "../components/dashboard/WellStatusChart";
import RecentMeasurements from "../components/dashboard/RecentMeasurements";
import RecentProduction from "../components/dashboard/RecentProduction";
import RecentMaintenance from "../components/dashboard/RecentMaintenance";
import RecentInterventions from "../components/dashboard/RecentInterventions";

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <p className="mt-4 text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="rounded-2xl bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">
            Failed to load dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome back 👋 Here's what's happening today.
          </p>
        </div>
      </div>

      {/* Statistics */}

      <DashboardStats data={data} />

      {/* Charts */}

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ProductionChart
            data={data.production_trend ?? []}
          />
        </div>

        <WellStatusChart
          active={data.running_wells}
          shutIn={data.maintenance_wells}
        />
      </div>

      {/* Measurements */}

      <RecentMeasurements
        data={data.recent_measurements}
      />

      {/* Production + Maintenance */}

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentProduction
          data={data.recent_production}
        />

        <RecentMaintenance
          data={data.recent_maintenance}
        />
      </div>

      {/* Interventions */}

      <RecentInterventions
        data={data.recent_interventions}
      />
    </div>
  );
}