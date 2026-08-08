
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
} from "recharts";

import api from "../../services/api";

const STATUS_COLORS = {
  Completed: "#16a34a",
  "In Progress": "#2563eb",
  Planned: "#eab308",
  Cancelled: "#dc2626",
};

const INTERVENTION_TYPES = [
  "Wireline",
  "Slickline",
  "Coiled Tubing",
  "Acid Stimulation",
  "Hydraulic Fracturing",
  "ESP Installation",
  "ESP Replacement",
  "Tubing Replacement",
  "Cementing",
  "Perforation",
  "Fishing",
  "Well Kill",
  "Other",
];

export default function InterventionReport() {
    const [fields, setFields] = useState([]);
    const [wells, setWells] = useState([]);
  const [report, setReport] = useState({
    summary: {},
    history: [],
    well_performance: [],
  });

  const [filters, setFilters] = useState({
    field: "",
    well: "",
    intervention_type: "",
    status: "",
    date_from: "",
    date_to: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const loadFields = async () => {
  try {
    const response = await api.get("/fields/");

    setFields(
      response.data?.results ||
      response.data ||
      []
    );
  } catch (error) {
    console.error(
      "Failed to load fields:",
      error
    );
  }
};

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/reports/interventions/",
        {
          params: filters,
        }
      );

      setReport({
        summary: response.data?.summary || {},
        history: response.data?.history || [],
        well_performance:
          response.data?.well_performance || [],
      });
    } catch (err) {
      console.error(
        "Failed to load intervention report:",
        err
      );

      setError(
        "Failed to load intervention report."
      );
    } finally {
      setLoading(false);
    }
  };
const exportExcel = async () => {
  try {
    const response = await api.get(
      "/reports/interventions/export/excel/",
      {
        params: filters,
        responseType: "blob",
      }
    );

    const blob = new Blob(
      [response.data],
      {
        type: response.headers[
          "content-type"
        ],
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "intervention_report.xlsx";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(
      "Failed to export Excel:",
      error
    );
  }
};
const exportPDF = async () => {
  try {
    const response = await api.get(
      "/reports/interventions/export/pdf/",
      {
        params: filters,
        responseType: "blob",
      }
    );

    const blob = new Blob(
      [response.data],
      {
        type: "application/pdf",
      }
    );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "intervention_report.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error(
      "Failed to export PDF:",
      error
    );
  }
};
useEffect(() => {
  const loadWells = async () => {
    try {
      if (!filters.field) {
        setWells([]);
        return;
      }

      const response = await api.get(
        "/wells/",
        {
          params: {
            field: filters.field,
          },
        }
      );

      setWells(
        response.data?.results ||
        response.data ||
        []
      );
    } catch (error) {
      console.error(
        "Failed to load wells:",
        error
      );

      setWells([]);
    }
  };
  loadFields();
  loadWells();
  loadReport();
}, [filters.field]);

  const updateFilter = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      field: "",
      well: "",
      intervention_type: "",
      status: "",
      date_from: "",
      date_to: "",
    });
  };

  // -----------------------------------------
  // Intervention Type Chart
  // -----------------------------------------

  const typeData = useMemo(() => {
    const counts = {};

    (report.history || []).forEach((item) => {
      const type =
        item.intervention_type || "Other";

      counts[type] =
        (counts[type] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
  }, [report.history]);

  // -----------------------------------------
  // Status Chart
  // -----------------------------------------

  const statusData = useMemo(() => {
    const counts = {};

    (report.history || []).forEach((item) => {
      const status =
        item.status || "Unknown";

      counts[status] =
        (counts[status] || 0) + 1;
    });

    return Object.entries(counts).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [report.history]);

  // -----------------------------------------
  // Timeline
  // -----------------------------------------

  const timelineData = useMemo(() => {
    const counts = {};

    (report.history || []).forEach((item) => {
      if (!item.start_date) return;

      const date = String(
        item.start_date
      );

      counts[date] =
        (counts[date] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([date, interventions]) => ({
        date,
        interventions,
      }))
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );
  }, [report.history]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* -------------------------------- */}
      {/* Header */}
      {/* -------------------------------- */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Intervention Report
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Analyze well intervention activities
            and operational performance.
          </p>
        </div>

        <div className="flex gap-3">

        <button
            onClick={loadReport}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
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

      {/* -------------------------------- */}
      {/* Error */}
      {/* -------------------------------- */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* -------------------------------- */}
      {/* Filters */}
      {/* -------------------------------- */}

      <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Filters
            </h2>

            <p className="text-sm text-gray-500">
              Filter intervention records.
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

          {/* Field */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Field ID
            </label>

            <select
            value={filters.field}
            onChange={(e) => {
                updateFilter(
                "field",
                e.target.value
                );

                updateFilter("well", "");
            }}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
            <option value="">
                All Fields
            </option>

            {fields.map((field) => (
                <option
                key={field.id}
                value={field.id}
                >
                {field.name} ({field.code})
                </option>
            ))}
            </select>
          </div>

          {/* Well */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Well ID
            </label>

            <select
            value={filters.well}
            onChange={(e) =>
                updateFilter(
                "well",
                e.target.value
                )
            }
            disabled={!filters.field}
            className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
            >
            <option value="">
                {filters.field
                ? "All Wells"
                : "Select a field first"}
            </option>

            {wells.map((well) => (
                <option
                key={well.id}
                value={well.id}
                >
                {well.code} - {well.name}
                </option>
            ))}
            </select>
          </div>

          {/* Type */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Intervention Type
            </label>

            <select
              value={
                filters.intervention_type
              }
              onChange={(e) =>
                updateFilter(
                  "intervention_type",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">
                All Types
              </option>

              {INTERVENTION_TYPES.map(
                (type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Status */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>

            <select
              value={filters.status}
              onChange={(e) =>
                updateFilter(
                  "status",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            >
              <option value="">
                All Statuses
              </option>

              <option value="Planned">
                Planned
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>

          {/* Date From */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              From
            </label>

            <input
              type="date"
              value={filters.date_from}
              onChange={(e) =>
                updateFilter(
                  "date_from",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

          {/* Date To */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              To
            </label>

            <input
              type="date"
              value={filters.date_to}
              onChange={(e) =>
                updateFilter(
                  "date_to",
                  e.target.value
                )
              }
              className="w-full rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
            />
          </div>

        </div>
      </div>

      {/* -------------------------------- */}
      {/* KPI Cards */}
      {/* -------------------------------- */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Interventions
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {report.summary
              ?.total_interventions ?? 0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {report.summary?.completed ??
              0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            In Progress
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {report.summary
              ?.in_progress ?? 0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Planned
          </p>

          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {report.summary?.planned ??
              0}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">
            Cancelled
          </p>

          <p className="mt-2 text-2xl font-bold text-red-600">
            {report.summary?.cancelled ??
              0}
          </p>
        </div>

      </div>

      {/* -------------------------------- */}
      {/* Charts */}
      {/* -------------------------------- */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* Intervention Types */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold">
            Interventions by Type
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={typeData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 60,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  name="Interventions"
                  fill="#2563eb"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* Status */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold">
            Interventions by Status
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>

                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                >
                  {statusData.map(
                    (entry) => (
                      <Cell
                        key={entry.name}
                        fill={
                          STATUS_COLORS[
                            entry.name
                          ] || "#6b7280"
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* Timeline */}

        <div className="rounded-xl border bg-white p-6 shadow-sm xl:col-span-2">

          <h2 className="mb-5 text-lg font-semibold">
            Interventions Over Time
          </h2>

          <div className="h-[350px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={timelineData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 20,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="date"
                />

                <YAxis
                  allowDecimals={false}
                />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="interventions"
                  name="Interventions"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>
      </div>
        <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold">
            Wells with Most Interventions
        </h2>

        {Array.isArray(report.well_performance) &&
        report.well_performance.length > 0 ? (
            <div className="h-[350px]">
            <ResponsiveContainer
                width="100%"
                height="100%"
            >
                <BarChart
                data={report.well_performance}
                layout="vertical"
                margin={{
                    top: 10,
                    right: 30,
                    left: 20,
                    bottom: 10,
                }}
                >
                <CartesianGrid
                    strokeDasharray="3 3"
                />

                <XAxis
                    type="number"
                    allowDecimals={false}
                />

                <YAxis
                    type="category"
                    dataKey="well"
                    width={100}
                />

                <Tooltip />

                <Bar
                    dataKey="intervention_count"
                    name="Interventions"
                    fill="#7c3aed"
                    radius={[0, 6, 6, 0]}
                />
                </BarChart>
            </ResponsiveContainer>
            </div>
        ) : (
            <div className="flex h-[350px] items-center justify-center">
            <p className="text-sm text-gray-500">
                No intervention data available.
            </p>
            </div>
        )}
        </div>
      {/* -------------------------------- */}
      {/* Intervention History */}
      {/* -------------------------------- */}

      <div className="mt-6 rounded-xl border bg-white shadow-sm">

        <div className="border-b p-6">

          <h2 className="text-lg font-semibold">
            Intervention History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Detailed intervention records.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-gray-50">

              <tr className="border-b text-left">

                <th className="whitespace-nowrap p-4">
                  Well
                </th>

                <th className="whitespace-nowrap p-4">
                  Field
                </th>

                <th className="whitespace-nowrap p-4">
                  Type
                </th>

                <th className="whitespace-nowrap p-4">
                  Title
                </th>

                <th className="whitespace-nowrap p-4">
                  Service Company
                </th>

                <th className="whitespace-nowrap p-4">
                  Supervisor
                </th>

                <th className="whitespace-nowrap p-4">
                  Start Date
                </th>

                <th className="whitespace-nowrap p-4">
                  End Date
                </th>

                <th className="whitespace-nowrap p-4">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {(report.history || []).map(
                (item) => (
                  <tr
                    key={item.id}
                    className="border-b hover:bg-gray-50"
                  >

                    <td className="whitespace-nowrap p-4 font-medium">
                      {item.well || "-"}
                    </td>

                    <td className="whitespace-nowrap p-4">
                      {item.field || "-"}
                    </td>

                    <td className="whitespace-nowrap p-4">
                      {item.intervention_type ||
                        "-"}
                    </td>

                    <td className="min-w-[180px] p-4">
                      {item.title || "-"}
                    </td>

                    <td className="whitespace-nowrap p-4">
                      {item.service_company ||
                        "-"}
                    </td>

                    <td className="whitespace-nowrap p-4">
                      {item.supervisor || "-"}
                    </td>

                    <td className="whitespace-nowrap p-4">
                      {item.start_date || "-"}
                    </td>

                    <td className="whitespace-nowrap p-4">
                      {item.end_date || "-"}
                    </td>

                    <td className="whitespace-nowrap p-4">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          item.status ===
                          "Completed"
                            ? "bg-green-100 text-green-700"
                            : item.status ===
                              "In Progress"
                            ? "bg-blue-100 text-blue-700"
                            : item.status ===
                              "Planned"
                            ? "bg-yellow-100 text-yellow-700"
                            : item.status ===
                              "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status || "-"}
                      </span>

                    </td>

                  </tr>
                )
              )}

              {(
                report.history || []
              ).length === 0 && (
                <tr>

                  <td
                    colSpan="9"
                    className="p-10 text-center text-gray-500"
                  >
                    No intervention records
                    found.
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
