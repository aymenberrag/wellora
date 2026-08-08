import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../../services/api";

const MAINTENANCE_TYPES = [
  "Preventive",
  "Corrective",
  "Inspection",
  "Calibration",
  "Repair",
  "Replacement",
];

const STATUSES = [
  "Planned",
  "In Progress",
  "Completed",
  "Cancelled",
];

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#eab308",
  "#dc2626",
  "#9333ea",
  "#0ea5e9",
  "#f97316",
];

const emptyReport = {
  summary: {},
  type_distribution: [],
  status_distribution: [],
  well_distribution: [],
  field_distribution: [],
  timeline: [],
  completed_vs_pending: [],
  history: [],
};

export default function MaintenanceReport() {
  const [fields, setFields] = useState([]);
  const [wells, setWells] = useState([]);
  const [report, setReport] = useState(emptyReport);
  const [filters, setFilters] = useState({
    field: "",
    well: "",
    maintenance_type: "",
    status: "",
    date_from: "",
    date_to: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFields = async () => {
    try {
      const response = await api.get("/fields/");
      setFields(response.data?.results || response.data || []);
    } catch (err) {
      console.error("Failed to load fields:", err);
      setFields([]);
    }
  };

  const loadWells = async (fieldId = "") => {
    try {
      const response = await api.get("/wells/", {
        params: fieldId ? { field: fieldId } : {},
      });
      setWells(response.data?.results || response.data || []);
    } catch (err) {
      console.error("Failed to load wells:", err);
      setWells([]);
    }
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reports/maintenance/", {
        params: filters,
      });

      setReport({
        ...emptyReport,
        ...(response.data || {}),
        summary: response.data?.summary || {},
        type_distribution: response.data?.type_distribution || [],
        status_distribution: response.data?.status_distribution || [],
        well_distribution: response.data?.well_distribution || [],
        field_distribution: response.data?.field_distribution || [],
        timeline: response.data?.timeline || [],
        completed_vs_pending: response.data?.completed_vs_pending || [],
        history: response.data?.history || [],
      });
    } catch (err) {
      console.error("Failed to load maintenance report:", err);
      setError("Failed to load maintenance report.");
    } finally {
      setLoading(false);
    }
  };

  const downloadExport = async (path, filename, contentType) => {
    try {
      const response = await api.get(path, {
        params: filters,
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: contentType })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Failed to export ${filename}:`, err);
    }
  };

  useEffect(() => {
    loadFields();
    loadWells();
    loadReport();
  }, []);

  useEffect(() => {
    loadWells(filters.field);
    setFilters((previous) => ({ ...previous, well: "" }));
  }, [filters.field]);

  const updateFilter = (name, value) => {
    setFilters((previous) => ({ ...previous, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      field: "",
      well: "",
      maintenance_type: "",
      status: "",
      date_from: "",
      date_to: "",
    });
  };

  const typeData = useMemo(
    () => report.type_distribution || [],
    [report.type_distribution]
  );
  const statusData = useMemo(
    () => report.status_distribution || [],
    [report.status_distribution]
  );
  const wellData = useMemo(
    () => report.well_distribution || [],
    [report.well_distribution]
  );
  const fieldData = useMemo(
    () => report.field_distribution || [],
    [report.field_distribution]
  );
  const timelineData = useMemo(
    () => report.timeline || [],
    [report.timeline]
  );
  const comparisonData = useMemo(
    () => report.completed_vs_pending || [],
    [report.completed_vs_pending]
  );

  const renderEmptyChart = () => (
    <div className="flex h-full items-center justify-center text-sm text-gray-500">
      No maintenance data available.
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Maintenance Report
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze maintenance activity, trends, and history.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadReport}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading maintenance report..." : "Generate Report"}
          </button>
          <button
            onClick={() => downloadExport(
              "/reports/maintenance/export/pdf/",
              "maintenance_report.pdf",
              "application/pdf"
            )}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Export PDF
          </button>
          <button
            onClick={() => downloadExport(
              "/reports/maintenance/export/excel/",
              "maintenance_report.xlsx",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )}
            className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700"
          >
            Export Excel
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <p className="text-sm text-gray-500">
              Filter maintenance records before generating the report.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="text-sm font-medium text-gray-700">
            Field
            <select
              value={filters.field}
              onChange={(event) => updateFilter("field", event.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            >
              <option value="">All Fields</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name} {field.code ? `(${field.code})` : ""}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Well
            <select
              value={filters.well}
              onChange={(event) => updateFilter("well", event.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            >
              <option value="">All Wells</option>
              {wells.map((well) => (
                <option key={well.id} value={well.id}>
                  {well.code} - {well.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Maintenance Type
            <select
              value={filters.maintenance_type}
              onChange={(event) => updateFilter("maintenance_type", event.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              {MAINTENANCE_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Status
            <select
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-gray-700">
            Date From
            <input
              type="date"
              value={filters.date_from}
              onChange={(event) => updateFilter("date_from", event.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Date To
            <input
              type="date"
              value={filters.date_to}
              onChange={(event) => updateFilter("date_to", event.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500"
            />
          </label>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          ["Total Maintenance", report.summary?.total_maintenance ?? 0, "text-gray-900"],
          ["Completed", report.summary?.completed ?? 0, "text-green-600"],
          ["In Progress", report.summary?.in_progress ?? 0, "text-blue-600"],
          ["Planned", report.summary?.planned ?? 0, "text-yellow-600"],
          ["Cancelled", report.summary?.cancelled ?? 0, "text-red-600"],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`mt-2 text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Maintenance by Type</h2>
          <div className="h-[350px]">
            {typeData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData} margin={{ bottom: 55 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" angle={-35} textAnchor="end" interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Maintenance" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : renderEmptyChart()}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Maintenance by Status</h2>
          <div className="h-[350px]">
            {statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={120} label>
                    {statusData.map((entry, index) => (
                      <Cell key={entry.status} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : renderEmptyChart()}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Maintenance by Well</h2>
          <div className="h-[350px]">
            {wellData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wellData} layout="vertical" margin={{ left: 35, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="well" width={90} />
                  <Tooltip />
                  <Bar dataKey="count" name="Maintenance" fill="#7c3aed" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : renderEmptyChart()}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Maintenance by Field</h2>
          <div className="h-[350px]">
            {fieldData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={fieldData} margin={{ bottom: 55 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="field" angle={-35} textAnchor="end" interval={0} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" name="Maintenance" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : renderEmptyChart()}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Maintenance Over Time</h2>
          <div className="h-[350px]">
            {timelineData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timelineData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" name="Maintenance" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : renderEmptyChart()}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Completed vs Pending</h2>
          <div className="h-[350px]">
            {comparisonData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="pending" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : renderEmptyChart()}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Maintenance History</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete filtered maintenance records.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b text-left">
                <th className="whitespace-nowrap p-4">Well</th>
                <th className="whitespace-nowrap p-4">Field</th>
                <th className="whitespace-nowrap p-4">Type</th>
                <th className="whitespace-nowrap p-4">Title</th>
                <th className="whitespace-nowrap p-4">Service Company</th>
                <th className="whitespace-nowrap p-4">Assigned To</th>
                <th className="whitespace-nowrap p-4">Start Date</th>
                <th className="whitespace-nowrap p-4">End Date</th>
                <th className="whitespace-nowrap p-4">Status</th>
                <th className="whitespace-nowrap p-4">Estimated Cost</th>
                <th className="whitespace-nowrap p-4">Actual Cost</th>
              </tr>
            </thead>
            <tbody>
              {(report.history || []).map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="whitespace-nowrap p-4 font-medium">{item.well || "-"}</td>
                  <td className="whitespace-nowrap p-4">{item.field || "-"}</td>
                  <td className="whitespace-nowrap p-4">{item.maintenance_type || "-"}</td>
                  <td className="min-w-[180px] p-4">{item.title || "-"}</td>
                  <td className="whitespace-nowrap p-4">{item.service_company || "-"}</td>
                  <td className="whitespace-nowrap p-4">{item.assigned_to || "-"}</td>
                  <td className="whitespace-nowrap p-4">{item.start_date || "-"}</td>
                  <td className="whitespace-nowrap p-4">{item.end_date || "-"}</td>
                  <td className="whitespace-nowrap p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      item.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "Planned"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                    }`}>
                      {item.status || "-"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap p-4">{item.estimated_cost ?? "-"}</td>
                  <td className="whitespace-nowrap p-4">{item.actual_cost ?? "-"}</td>
                </tr>
              ))}
              {(report.history || []).length === 0 && (
                <tr>
                  <td colSpan="11" className="p-10 text-center text-gray-500">
                    No maintenance data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
