
import { useState } from "react";

import ProductionReport from "./ProductionReport";
import WellTestReport from "./WellTestReport";
import WellReport from "./WellReport";
import MaintenanceReport from "./MaintenanceReport";
import FieldReport from "./FieldReport";
import MeasurementReport from "./MeasurementReport";
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
    id: "well",
    label: "Well",
  },
  {
    id: "maintenance",
    label: "Maintenance",
  },
  {
    id: "field",
    label: "Field",
  },
  {
    id: "measurement",
    label: "Measurement",
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

        case "well":
          return <WellReport />;

      case "maintenance":
        return <MaintenanceReport />;

      case "field":
        return <FieldReport />;

      case "measurement":
        return <MeasurementReport />;

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

