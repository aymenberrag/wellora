
import { useState } from "react";

import ProductionReport from "./ProductionReport";
import WellTestReport from "./WellTestReport";
// import MaintenanceReport from "./MaintenanceReport";
import InterventionReport from "./InterventionReport";

const tabs = [
  {
    id: "production",
    label: "Production",
  },
  {
    id: "well-test",
    label: "Well Test",
  },
  {
    id: "maintenance",
    label: "Maintenance",
  },
  {
    id: "intervention",
    label: "Intervention",
  },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState(
    "production"
  );

  const renderReport = () => {
    switch (activeTab) {
      case "production":
        return <ProductionReport />;

      case "well-test":
        return <WellTestReport />;

      case "maintenance":
        return (
          <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="text-lg font-semibold">
              Maintenance Report
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Coming next.
            </p>
          </div>
        );

      case "intervention":
        return <InterventionReport />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-gray-50">

      {/* Page Header */}
      <div className="border-b bg-white px-6 pt-6">

        <div className="mb-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Reports
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analyze and monitor your oil & gas operations.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 overflow-x-auto">

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative whitespace-nowrap
                px-1 pb-4 text-sm font-medium
                transition-colors
                ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-500 hover:text-gray-900"
                }
              `}
            >
              {tab.label}

              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}

        </div>

      </div>

      {/* Active Report */}
      <div className="p-6">
        {renderReport()}
      </div>

    </div>
  );
};

export default Reports;

