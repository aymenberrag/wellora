
import { useEffect, useState } from "react";
import api from "../../services/api";
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ProductionReport = () => {
    const [fields, setFields] = useState([]);
    const [wells, setWells] = useState([]);
  const [report, setReport] = useState(null);

  const [filters, setFilters] = useState({
    field: "",
    well: "",
    date_from: "",
    date_to: "",
  });
    const exportPDF = async () => {
    try {
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
        "/reports/production/pdf/",
        {
            params,
            responseType: "blob",
        }
        );

        const blob = new Blob(
        [response.data],
        {
            type: "application/pdf",
        }
        );

        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "production-report.pdf";

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
    const fetchFields = async () => {
        try {
            const response = await api.get("/fields/");

            setFields(
            response.data.results || response.data
            );
        } catch (err) {
            console.error("Failed to load fields:", err);
        }
        };
    const fetchWells = async (fieldId = "") => {
        try {
        const params = {};

        if (fieldId) {
        params.field = fieldId;
        }

        const response = await api.get(
        "/wells/",
        { params }
        );

        setWells(
        response.data.results || response.data
        );
    } catch (err) {
        console.error("Failed to load wells:", err);
    }
    };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReport = async () => {
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
        "/reports/production/",
        {
          params,
        }
      );

      setReport(response.data);
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
        "Failed to load production report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
    fetchWells(filters.field);
    fetchReport();
  }, []);

    const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
        ...previous,
        [name]: value,
        ...(name === "field"
        ? { well: "" }
        : {}),
    }));
    };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchReport();
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
    const exportExcel = () => {
    if (!report) {
        return;
    }

    const summaryData = [
        {
        Metric: "Total Oil",
        Value: report.summary.total_oil,
        Unit: "BOPD",
        },
        {
        Metric: "Total Gas",
        Value: report.summary.total_gas,
        Unit: "MSCFD",
        },
        {
        Metric: "Total Water",
        Value: report.summary.total_water,
        Unit: "BWPD",
        },
        {
        Metric: "Average Oil",
        Value: report.summary.average_oil,
        Unit: "BOPD",
        },
        {
        Metric: "Average Gas",
        Value: report.summary.average_gas,
        Unit: "MSCFD",
        },
        {
        Metric: "Average Water",
        Value: report.summary.average_water,
        Unit: "BWPD",
        },
        {
        Metric: "Production Records",
        Value: report.summary.total_records,
        Unit: "",
        },
    ];

    const dailyData =
        report.daily_production.map((item) => ({
        Date: item.date,
        "Oil Production (BOPD)": item.oil,
        "Gas Production (MSCFD)": item.gas,
        "Water Production (BWPD)": item.water,
        }));

    const wellData =
        report.top_wells.map((well) => ({
        "Well Code": well.well_code,
        "Well Name": well.well_name,
        "Oil Production (BOPD)": well.oil,
        "Gas Production (MSCFD)": well.gas,
        "Water Production (BWPD)": well.water,
        }));

    const workbook = XLSX.utils.book_new();

    const summarySheet =
        XLSX.utils.json_to_sheet(summaryData);

    const dailySheet =
        XLSX.utils.json_to_sheet(dailyData);

    const wellsSheet =
        XLSX.utils.json_to_sheet(wellData);

    XLSX.utils.book_append_sheet(
        workbook,
        summarySheet,
        "Summary"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        dailySheet,
        "Daily Production"
    );

    XLSX.utils.book_append_sheet(
        workbook,
        wellsSheet,
        "Top Wells"
    );

    const excelBuffer =
        XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        });

    const blob = new Blob(
        [excelBuffer],
        {
        type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
    );

    saveAs(
        blob,
        "production-report.xlsx"
    );
    };
  return (
    <div className="space-y-6">

      {/* Filters */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        >

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Field
            </label>

            <select
            name="field"
            value={filters.field}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
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
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Well
            </label>

            <select
            name="well"
            value={filters.well}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            >
            <option value="">
                All Wells
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

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              From
            </label>

            <input
              type="date"
              name="date_from"
              value={filters.date_from}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              To
            </label>

            <input
              type="date"
              name="date_to"
              value={filters.date_to}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>

            <div className="flex flex-wrap gap-3">

            {report && (
            <>
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                    ? "Generating..."
                    : "Generate Report"}
                </button>
                <button
                type="button"
                onClick={exportExcel}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                Export Excel
                </button>

                <button
                type="button"
                onClick={exportPDF}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                Export PDF
                </button>
            </>
            )}

            </div>

        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && !report && (
        <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
          Loading report...
        </div>
      )}

      {/* Report */}
      {report && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">
                Total Oil
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(report.summary.total_oil)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                BOPD
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">
                Total Gas
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(report.summary.total_gas)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                MSCFD
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">
                Total Water
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(report.summary.total_water)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                BWPD
              </p>
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500">
                Records
              </p>

              <p className="mt-2 text-2xl font-bold text-gray-900">
                {formatNumber(report.summary.total_records)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Production records
              </p>
            </div>

          </div>

          {/* Daily Production */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Daily Production
              </h2>

                <div className="mb-8 h-[350px] w-full">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <LineChart
                    data={report.daily_production}
                    margin={{
                        top: 10,
                        right: 20,
                        left: 10,
                        bottom: 10,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                    />

                    <YAxis
                        tick={{ fontSize: 12 }}
                    />

                    <Tooltip
                    formatter={(value, name) => {
                        const units = {
                        oil: " BOPD",
                        gas: " MSCFD",
                        water: " BWPD",
                        };

                        return [
                        `${Number(value).toLocaleString()}${
                            units[name] || ""
                        }`,
                        name,
                        ];
                    }}
                    />

                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="oil"
                        name="Oil"
                        stroke="#2563eb"
                        strokeWidth={2}
                        dot={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="gas"
                        name="Gas"
                        stroke="#16a34a"
                        strokeWidth={2}
                        dot={false}
                    />

                    <Line
                        type="monotone"
                        dataKey="water"
                        name="Water"
                        stroke="#0891b2"
                        strokeWidth={2}
                        dot={false}
                    />
                    </LineChart>
                </ResponsiveContainer>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                    Average Oil
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                    {formatNumber(report.summary.average_oil)}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                        BOPD
                    </span>
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                    Average Gas
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                    {formatNumber(report.summary.average_gas)}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                        MSCFD
                    </span>
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                    Average Water
                    </p>

                    <p className="mt-1 text-xl font-semibold text-gray-900">
                    {formatNumber(report.summary.average_water)}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                        BWPD
                    </span>
                    </p>
                </div>

                </div>

              <p className="text-sm text-gray-500">
                Production by date.
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="min-w-full text-sm">

                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">
                      Date
                    </th>

                    <th className="px-4 py-3 font-medium text-gray-600">
                      Oil
                    </th>

                    <th className="px-4 py-3 font-medium text-gray-600">
                      Gas
                    </th>

                    <th className="px-4 py-3 font-medium text-gray-600">
                      Water
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {report.daily_production.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No production data found.
                      </td>
                    </tr>
                  ) : (
                    report.daily_production.map(
                      (item) => (
                        <tr
                          key={item.date}
                          className="border-b border-gray-100"
                        >
                          <td className="px-4 py-3">
                            {item.date}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(item.oil)}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(item.gas)}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(item.water)}
                          </td>
                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

          {/* Top Wells */}
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">

            <div className="mb-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Top Producing Wells
              </h2>

              <p className="text-sm text-gray-500">
                Top 10 wells ranked by oil production.
              </p>
            </div>

            <div className="overflow-x-auto">

              <table className="min-w-full text-sm">

                <thead>
                  <tr className="border-b border-gray-200 text-left">

                    <th className="px-4 py-3 font-medium text-gray-600">
                      Well
                    </th>

                    <th className="px-4 py-3 font-medium text-gray-600">
                      Oil
                    </th>

                    <th className="px-4 py-3 font-medium text-gray-600">
                      Gas
                    </th>

                    <th className="px-4 py-3 font-medium text-gray-600">
                      Water
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {report.top_wells.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        No wells found.
                      </td>
                    </tr>
                  ) : (
                    report.top_wells.map(
                      (well) => (
                        <tr
                          key={well.well_id}
                          className="border-b border-gray-100"
                        >

                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">
                              {well.well_code}
                            </div>

                            <div className="text-xs text-gray-500">
                              {well.well_name}
                            </div>
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(well.oil)}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(well.gas)}
                          </td>

                          <td className="px-4 py-3">
                            {formatNumber(well.water)}
                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default ProductionReport;

