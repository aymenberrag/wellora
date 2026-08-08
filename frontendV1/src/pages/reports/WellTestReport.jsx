
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import api from "../../services/api";

const WellTestReport = () => {
  const [report, setReport] = useState({
    summary: {},
    history: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState([]);
const [wells, setWells] = useState([]);

  const [filters, setFilters] = useState({
    field: "",
    well: "",
    date_from: "",
    date_to: "",
  });
const exportExcel = async () => {
  try {
    const params = {
      ...filters,
    };

    const response = await api.get(
      "/reports/well-tests/export/excel/",
      {
        params,
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.download = "well_test_report.xlsx";

    document.body.appendChild(link);
    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error(
      "Failed to export Excel:",
      err
    );
  }
};
    const exportPDF = async () => {
    try {
        const params = {
        ...filters,
        };

        const response = await api.get(
        "/reports/well-tests/export/pdf/",
        {
            params,
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
        link.download = "well_test_report.pdf";

        document.body.appendChild(link);
        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(
        "Failed to export PDF:",
        err
        );
    }
    };
    const loadFields = async () => {
    try {
        const response = await api.get("/fields/");
        setFields(response.data.results || response.data);
    } catch (err) {
        console.error("Failed to load fields:", err);
    }
    };

    const loadWells = async () => {
    try {
        const response = await api.get("/wells/");
        setWells(response.data.results || response.data);
    } catch (err) {
        console.error("Failed to load wells:", err);
    }
    };
  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (filters.field) {
        params.field = filters.field;
      }

      if (filters.well) {
        params.well = filters.well;
      }

      if (filters.date_from) {
        params.date_from = filters.date_from;
      }

      if (filters.date_to) {
        params.date_to = filters.date_to;
      }

      const response = await api.get(
        "/reports/well-tests/",
        { params }
      );

      setReport(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load well test report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
    loadWells();
    loadReport();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) {
      return "0";
    }

    return Number(value).toLocaleString(
      undefined,
      {
        maximumFractionDigits: 2,
      }
    );
  };

  return (
    <div className="space-y-6 p-6">


      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

          <div>
            <label className="mb-1 block text-sm font-medium">
              Field
            </label>

            <select
            name="field"
            value={filters.field}
            onChange={handleFilterChange}
            className="w-full rounded-lg border px-3 py-2"
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

          <div>
            <label className="mb-1 block text-sm font-medium">
              Well
            </label>

            <select
            name="well"
            value={filters.well}
            onChange={handleFilterChange}
            className="w-full rounded-lg border px-3 py-2"
            >
            <option value="">
                All Wells
            </option>

            {wells
                .filter((well) => {
                if (!filters.field) {
                    return true;
                }

                return String(well.field) === String(
                    filters.field
                );
                })
                .map((well) => (
                <option
                    key={well.id}
                    value={well.id}
                >
                    {well.code} - {well.name}
                </option>
                ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Date From
            </label>

            <input
              type="date"
              name="date_from"
              value={filters.date_from}
              onChange={handleFilterChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Date To
            </label>

            <input
              type="date"
              name="date_to"
              value={filters.date_to}
              onChange={handleFilterChange}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

        </div>

        <div className="flex flex-wrap gap-3">

        <button
            onClick={loadReport}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
            {loading ? "Loading..." : "Generate Report"}
        </button>

        <button
            onClick={exportExcel}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            Export Excel
        </button>

        <button
            onClick={exportPDF}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
            Export PDF
        </button>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {report && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Total Tests
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {report.summary?.total_tests ?? 0}
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Average Oil Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(
                  report.summary?.average_oil_rate ?? 0
                ).toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                BOPD
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Average Gas Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(
                  report.summary?.average_gas_rate ?? 0
                ).toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                MSCFD
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Average Water Rate
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(
                  report.summary?.average_water_rate ?? 0
                ).toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                BWPD
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Average WHP
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(
                  report.summary?.average_wellhead_pressure ?? 0
                ).toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                psi
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Average BHP
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(
                  report.summary?.average_bottomhole_pressure ?? 0
                ).toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                psi
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Average Water Cut
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(
                  report.summary?.average_water_cut ?? 0
                ).toFixed(2)}
                %
              </p>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">
                Average GOR
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(
                  report.summary?.average_gor ?? 0
                ).toFixed(2)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                scf/STB
              </p>
            </div>

          </div>

          {/* Production Rates */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold">
              Test Production Rates
            </h2>

            <div className="h-[350px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
              <LineChart data={report.production_history || []}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="date" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="oil_rate"
                  stroke="#16a34a"
                  strokeWidth={2}
                  name="Oil (BOPD)"
                />

                <Line
                  type="monotone"
                  dataKey="gas_rate"
                  stroke="#2563eb"
                  strokeWidth={2}
                  name="Gas (MSCFD)"
                />

                <Line
                  type="monotone"
                  dataKey="water_rate"
                  stroke="#0891b2"
                  strokeWidth={2}
                  name="Water (BWPD)"
                />
              </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Pressure */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold">
              Pressure Analysis
            </h2>

            <div className="h-[350px]">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={report.pressure_history}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="date"
                  />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="wellhead_pressure"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    name="Wellhead Pressure"
                  />

                  <Line
                    type="monotone"
                    dataKey="bottomhole_pressure"
                    stroke="#dc2626"
                    strokeWidth={2}
                    name="Bottomhole Pressure"
                  />

                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

            {/* Water Cut & GOR */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold">
                Water Cut Trend
                </h2>

                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={report.test_history || []}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="water_cut"
                        stroke="#0891b2"
                        strokeWidth={2}
                        name="Water Cut (%)"
                        connectNulls
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>

            {/* GOR */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold">
                GOR Trend
                </h2>

                <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={report.test_history || []}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="gor"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        name="GOR"
                        connectNulls
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>
            </div>

            </div>

            <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold">
                Choke Size Trend
            </h2>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.test_history || []}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="date" />

                    <YAxis />

                    <Tooltip />

                    <Legend />

                    <Line
                    type="monotone"
                    dataKey="choke_size"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    name="Choke Size (1/64 in)"
                    connectNulls
                    />

                </LineChart>
                </ResponsiveContainer>
            </div>

            </div>

          {/* Test History */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-semibold">
              Test History
            </h2>

            <div className="overflow-x-auto">

              <table className="min-w-full text-sm">

                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3">
                      Date
                    </th>

                    <th className="px-4 py-3">
                      Well
                    </th>

                    <th className="px-4 py-3">
                      Oil
                    </th>

                    <th className="px-4 py-3">
                      Gas
                    </th>

                    <th className="px-4 py-3">
                      Water
                    </th>

                    <th className="px-4 py-3">
                      WHP
                    </th>

                    <th className="px-4 py-3">
                      BHP
                    </th>

                    <th className="px-4 py-3">
                      Choke
                    </th>

                    <th className="px-4 py-3">
                      Water Cut
                    </th>

                    <th className="px-4 py-3">
                      GOR
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {(report.test_history || []).map(
                    (test, index) => (
                      <tr
                        key={index}
                        className="border-b"
                      >
                        <td className="px-4 py-3">
                          {test.date}
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {test.well}
                        </td>

                        <td className="px-4 py-3">
                          {formatNumber(
                            test.oil_rate
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatNumber(
                            test.gas_rate
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatNumber(
                            test.water_rate
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatNumber(
                            test.wellhead_pressure
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatNumber(
                            test.bottomhole_pressure
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatNumber(
                            test.choke_size
                          )}
                        </td>

                        <td className="px-4 py-3">
                          {formatNumber(
                            test.water_cut
                          )}%
                        </td>

                        <td className="px-4 py-3">
                          {formatNumber(
                            test.gor
                          )}
                        </td>
                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">
              Top Producing Wells
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="p-3">Well</th>
                    <th className="p-3">Avg Oil</th>
                    <th className="p-3">Avg Gas</th>
                    <th className="p-3">Avg Water</th>
                    <th className="p-3">Tests</th>
                  </tr>
                </thead>

                <tbody>
                  {(report.well_performance || [])
                    .slice(0, 10)
                    .map((well, index) => (
                      <tr
                        key={index}
                        className="border-b"
                      >
                        <td className="p-3 font-medium">
                          {well.well}
                        </td>

                        <td className="p-3">
                          {Number(
                            well.average_oil_rate
                          ).toFixed(2)}
                        </td>

                        <td className="p-3">
                          {Number(
                            well.average_gas_rate
                          ).toFixed(2)}
                        </td>

                        <td className="p-3">
                          {Number(
                            well.average_water_rate
                          ).toFixed(2)}
                        </td>

                        <td className="p-3">
                          {well.test_count}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold">
              Declining Wells
            </h2>

            {(report.declining_wells || []).length === 0 ? (
              <p className="text-sm text-gray-500">
                No declining wells detected.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3">Well</th>
                      <th className="p-3">First Oil Rate</th>
                      <th className="p-3">Latest Oil Rate</th>
                      <th className="p-3">Decline</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.declining_wells
                      .slice(0, 10)
                      .map((well, index) => (
                        <tr
                          key={index}
                          className="border-b"
                        >
                          <td className="p-3 font-medium">
                            {well.well}
                          </td>

                          <td className="p-3">
                            {Number(
                              well.first_oil_rate
                            ).toFixed(2)}
                          </td>

                          <td className="p-3">
                            {Number(
                              well.latest_oil_rate
                            ).toFixed(2)}
                          </td>

                          <td className="p-3 font-semibold text-red-600">
                            {Number(
                              well.decline_percentage
                            ).toFixed(2)}
                            %
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default WellTestReport;

