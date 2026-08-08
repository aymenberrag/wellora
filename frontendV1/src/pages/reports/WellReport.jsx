import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

import api from "../../services/api";

const WELL_TYPES = [
  "Oil",
  "Gas",
  "Water Injector",
  "Gas Injector",
  "Exploration",
];

const STATUSES = [
  "Drilling",
  "Producing",
  "Shut In",
  "Workover",
  "Abandoned",
];

const ARTIFICIAL_LIFTS = [
  "Natural Flow",
  "ESP",
  "Gas Lift",
  "Rod Pump",
  "PCP",
  "Other",
];

const COLOR_PALETTE = [
  "#2563eb",
  "#9333ea",
  "#0ea5e9",
  "#16a34a",
  "#f97316",
  "#e11d48",
  "#84cc16",
  "#64748b",
  "#fb7185",
  "#0f766e",
];

export default function WellReport() {
  const [fields, setFields] = useState([]);
  const [operators, setOperators] = useState([]);
  const [report, setReport] = useState({
    summary: {},
    well_type_distribution: [],
    status_distribution: [],
    field_distribution: [],
    operator_distribution: [],
    artificial_lift_distribution: [],
    reservoir_distribution: [],
    formation_distribution: [],
    timeline: [],
    locations: [],
    history: [],
  });
  const [filters, setFilters] = useState({
    field: "",
    operator: "",
    well_type: "",
    status: "",
    artificial_lift: "",
    is_active: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFields = async () => {
    try {
      const response = await api.get("/fields/");
      setFields(response.data.results || response.data || []);
    } catch (err) {
      console.error("Failed to load fields:", err);
      setFields([]);
    }
  };

  const loadOperators = async () => {
    try {
      const response = await api.get("/companies/");
      setOperators(response.data.results || response.data || []);
    } catch (err) {
      console.error("Failed to load operators:", err);
      setOperators([]);
    }
  };

  const buildParams = () => {
    const params = {};

    if (filters.field) {
      params.field = filters.field;
    }
    if (filters.operator) {
      params.operator = filters.operator;
    }
    if (filters.well_type) {
      params.well_type = filters.well_type;
    }
    if (filters.status) {
      params.status = filters.status;
    }
    if (filters.artificial_lift) {
      params.artificial_lift = filters.artificial_lift;
    }
    if (filters.is_active) {
      params.is_active = filters.is_active;
    }

    return params;
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reports/wells/", {
        params: buildParams(),
      });

      setReport({
        summary: response.data?.summary || {},
        well_type_distribution:
          response.data?.well_type_distribution || [],
        status_distribution:
          response.data?.status_distribution || [],
        field_distribution:
          response.data?.field_distribution || [],
        operator_distribution:
          response.data?.operator_distribution || [],
        artificial_lift_distribution:
          response.data?.artificial_lift_distribution || [],
        reservoir_distribution:
          response.data?.reservoir_distribution || [],
        formation_distribution:
          response.data?.formation_distribution || [],
        timeline: response.data?.timeline || [],
        locations: response.data?.locations || [],
        history: response.data?.history || [],
      });
    } catch (err) {
      console.error("Failed to load well report:", err);
      setError("Failed to load well report.");
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = async () => {
    try {
      const response = await api.get(
        "/reports/wells/export/excel/",
        {
          params: buildParams(),
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "well_report.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export Excel:", err);
    }
  };

  const exportPDF = async () => {
    try {
      const response = await api.get(
        "/reports/wells/export/pdf/",
        {
          params: buildParams(),
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "well_report.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export PDF:", err);
    }
  };

  useEffect(() => {
    loadFields();
    loadOperators();
    loadReport();
  }, []);

  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      field: "",
      operator: "",
      well_type: "",
      status: "",
      artificial_lift: "",
      is_active: "",
    });
  };

  const fieldData = useMemo(
    () => report.field_distribution || [],
    [report.field_distribution]
  );

  const statusData = useMemo(
    () => report.status_distribution || [],
    [report.status_distribution]
  );

  const typeData = useMemo(
    () => report.well_type_distribution || [],
    [report.well_type_distribution]
  );

  const operatorData = useMemo(
    () => report.operator_distribution || [],
    [report.operator_distribution]
  );

  const liftData = useMemo(
    () => report.artificial_lift_distribution || [],
    [report.artificial_lift_distribution]
  );

  const reservoirData = useMemo(
    () => report.reservoir_distribution || [],
    [report.reservoir_distribution]
  );

  const formationData = useMemo(
    () => report.formation_distribution || [],
    [report.formation_distribution]
  );

  const timelineData = useMemo(
    () => report.timeline || [],
    [report.timeline]
  );

  const locationData = useMemo(
    () => report.locations || [],
    [report.locations]
  );

  const hasHistory =
    Array.isArray(report.history) && report.history.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Well Report
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze well performance, distribution, and inventory.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={loadReport}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>

          <button
            onClick={exportPDF}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
          >
            Export PDF
          </button>

          <button
            onClick={exportExcel}
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
            <h2 className="text-lg font-semibold text-gray-900">
              Filters
            </h2>
            <p className="text-sm text-gray-500">
              Slice the well dataset by field, operator, type, status, lift, and activity.
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Field
            </label>
            <select
              value={filters.field}
              onChange={(e) => updateFilter("field", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">All Fields</option>
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.name} {field.code ? `(${field.code})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Operator
            </label>
            <select
              value={filters.operator}
              onChange={(e) => updateFilter("operator", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">All Operators</option>
              {operators.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.short_name || company.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Well Type
            </label>
            <select
              value={filters.well_type}
              onChange={(e) => updateFilter("well_type", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">All Types</option>
              {WELL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => updateFilter("status", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Artificial Lift
            </label>
            <select
              value={filters.artificial_lift}
              onChange={(e) => updateFilter("artificial_lift", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">All Lift Types</option>
              {ARTIFICIAL_LIFTS.map((lift) => (
                <option key={lift} value={lift}>
                  {lift}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Active
            </label>
            <select
              value={filters.is_active}
              onChange={(e) => updateFilter("is_active", e.target.value)}
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-6">
        <div className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2">
          <p className="text-sm text-gray-500">Total Wells</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {report.summary?.total_wells ?? 0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2">
          <p className="text-sm text-gray-500">Active Wells</p>
          <p className="mt-2 text-2xl font-bold text-green-700">
            {report.summary?.active_wells ?? 0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2">
          <p className="text-sm text-gray-500">Producing Wells</p>
          <p className="mt-2 text-2xl font-bold text-blue-700">
            {report.summary?.producing_wells ?? 0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2">
          <p className="text-sm text-gray-500">Drilling Wells</p>
          <p className="mt-2 text-2xl font-bold text-indigo-700">
            {report.summary?.drilling_wells ?? 0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2">
          <p className="text-sm text-gray-500">Shut In Wells</p>
          <p className="mt-2 text-2xl font-bold text-orange-700">
            {report.summary?.shut_in_wells ?? 0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm xl:col-span-2">
          <p className="text-sm text-gray-500">Abandoned Wells</p>
          <p className="mt-2 text-2xl font-bold text-red-700">
            {report.summary?.abandoned_wells ?? 0}
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Wells by Type</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" angle={-35} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Wells by Status</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={120} label>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.status} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 mt-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Wells by Field</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fieldData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" angle={-35} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Wells by Operator</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={operatorData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="operator" angle={-35} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 mt-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Artificial Lift Distribution</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={liftData} dataKey="count" nameKey="artificial_lift" cx="50%" cy="50%" outerRadius={120} label>
                  {liftData.map((entry, index) => (
                    <Cell key={entry.artificial_lift} fill={COLOR_PALETTE[index % COLOR_PALETTE.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Average Depth</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border bg-slate-50 p-5">
              <p className="text-sm text-gray-500">Average Total Depth</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(report.summary?.average_total_depth ?? 0).toFixed(2)}
              </p>
            </div>
            <div className="rounded-xl border bg-slate-50 p-5">
              <p className="text-sm text-gray-500">Average True Vertical Depth</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(report.summary?.average_true_vertical_depth ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 mt-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Reservoir Distribution</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reservoirData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="reservoir" angle={-35} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold">Formation Distribution</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={formationData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="formation" angle={-35} textAnchor="end" interval={0} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm mt-6">
        <h2 className="mb-5 text-lg font-semibold">Well Timeline</h2>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timelineData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="spud" name="Spud Wells" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="completed" name="Completed Wells" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="first_production" name="First Production" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm mt-6">
        <h2 className="mb-5 text-lg font-semibold">Well Location</h2>
        {locationData.length > 0 ? (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="longitude" type="number" name="Longitude" />
                <YAxis dataKey="latitude" type="number" name="Latitude" />
                <ZAxis range={[100]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={locationData} fill="#2563eb" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[120px] items-center justify-center text-sm text-gray-500">
            No location coordinates available.
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Well Inventory</h2>
          <p className="mt-1 text-sm text-gray-500">
            Complete well table filtered by the selected criteria.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b text-left">
                <th className="whitespace-nowrap p-4">Code</th>
                <th className="whitespace-nowrap p-4">Name</th>
                <th className="whitespace-nowrap p-4">Field</th>
                <th className="whitespace-nowrap p-4">Operator</th>
                <th className="whitespace-nowrap p-4">Well Type</th>
                <th className="whitespace-nowrap p-4">Status</th>
                <th className="whitespace-nowrap p-4">Spud Date</th>
                <th className="whitespace-nowrap p-4">Completion Date</th>
                <th className="whitespace-nowrap p-4">First Production</th>
                <th className="whitespace-nowrap p-4">Total Depth</th>
                <th className="whitespace-nowrap p-4">True Vertical Depth</th>
                <th className="whitespace-nowrap p-4">Tubing Size</th>
                <th className="whitespace-nowrap p-4">Casing Size</th>
                <th className="whitespace-nowrap p-4">Artificial Lift</th>
                <th className="whitespace-nowrap p-4">Reservoir</th>
                <th className="whitespace-nowrap p-4">Formation</th>
                <th className="whitespace-nowrap p-4">Latitude</th>
                <th className="whitespace-nowrap p-4">Longitude</th>
                <th className="whitespace-nowrap p-4">Active</th>
              </tr>
            </thead>
            <tbody>
              {hasHistory ? (
                report.history.map((item) => (
                  <tr key={item.code} className="border-b hover:bg-gray-50">
                    <td className="whitespace-nowrap p-4 font-medium">{item.code || "-"}</td>
                    <td className="min-w-[180px] p-4">{item.name || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.field || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.operator || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.well_type || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.status || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.spud_date || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.completion_date || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.first_production_date || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.total_depth ?? "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.true_vertical_depth ?? "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.tubing_size || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.casing_size || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.artificial_lift || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.reservoir || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.formation || "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.latitude ?? "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.longitude ?? "-"}</td>
                    <td className="whitespace-nowrap p-4">{item.is_active ? "Yes" : "No"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="19" className="p-10 text-center text-gray-500">
                    No well inventory data available.
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
