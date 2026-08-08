import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../../services/api";

const STATUSES = ["Active", "Development", "Inactive", "Abandoned"];
const COLORS = ["#2563eb", "#16a34a", "#eab308", "#dc2626", "#9333ea", "#0891b2"];
const EMPTY_REPORT = {
  summary: {},
  status_distribution: [],
  operator_distribution: [],
  location_distribution: [],
  well_distribution: [],
  well_type_distribution: [],
  production_by_field: [],
  history: [],
};

export default function FieldReport() {
  const [operators, setOperators] = useState([]);
  const [report, setReport] = useState(EMPTY_REPORT);
  const [filters, setFilters] = useState({
    operator: "",
    status: "",
    location: "",
    date_from: "",
    date_to: "",
  });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState("");
  const [error, setError] = useState("");

  const loadOperators = async () => {
    try {
      const response = await api.get("/companies/");
      setOperators(response.data?.results || response.data || []);
    } catch (err) {
      console.error("Failed to load operators:", err);
      setOperators([]);
    }
  };

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/reports/fields/", { params: filters });
      setReport({
        ...EMPTY_REPORT,
        ...(response.data || {}),
        summary: response.data?.summary || {},
        status_distribution: response.data?.status_distribution || [],
        operator_distribution: response.data?.operator_distribution || [],
        location_distribution: response.data?.location_distribution || [],
        well_distribution: response.data?.well_distribution || [],
        well_type_distribution: response.data?.well_type_distribution || [],
        production_by_field: response.data?.production_by_field || [],
        history: response.data?.history || [],
      });
    } catch (err) {
      console.error("Failed to load field report:", err);
      setError(err.response?.data?.error || "Failed to load field report.");
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async (path, filename, type) => {
    try {
      setExporting(filename);
      const response = await api.get(path, { params: filters, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type }));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Failed to export ${filename}:`, err);
      setError(`Failed to export ${filename}.`);
    } finally {
      setExporting("");
    }
  };

  useEffect(() => {
    loadOperators();
    loadReport();
  }, []);

  const updateFilter = (name, value) => setFilters((previous) => ({ ...previous, [name]: value }));
  const clearFilters = () => setFilters({ operator: "", status: "", location: "", date_from: "", date_to: "" });
  const statusData = useMemo(() => report.status_distribution || [], [report.status_distribution]);
  const operatorData = useMemo(() => report.operator_distribution || [], [report.operator_distribution]);
  const locationData = useMemo(() => report.location_distribution || [], [report.location_distribution]);
  const fieldData = useMemo(() => report.well_distribution || [], [report.well_distribution]);
  const wellTypeData = useMemo(() => report.well_type_distribution || [], [report.well_type_distribution]);
  const productionData = useMemo(() => report.production_by_field || [], [report.production_by_field]);
  const number = (value) => Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const selectClass = "mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500";

  const Empty = () => <div className="flex h-full items-center justify-center text-sm text-gray-500">No field data available.</div>;
  const BarCard = ({ title, data, keyName, color }) => <div className="rounded-xl border bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold">{title}</h2><div className="h-[320px]">{data.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ left: 5, right: 20, bottom: 60 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey={keyName} angle={-35} textAnchor="end" interval={0} /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" name="Count" fill={color} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer> : <Empty />}</div></div>;
  const PieCard = ({ title, data, keyName }) => <div className="rounded-xl border bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold">{title}</h2><div className="h-[320px]">{data.length ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data} dataKey="count" nameKey={keyName} cx="50%" cy="50%" outerRadius={110} label>{data.map((entry, index) => <Cell key={entry[keyName]} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer> : <Empty />}</div></div>;

  return <div className="min-h-screen bg-gray-50 p-6">
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Field Report</h1><p className="mt-1 text-sm text-gray-500">Analyze field status, ownership, wells, and production performance.</p></div><div className="flex flex-wrap gap-3"><button onClick={loadReport} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? "Loading..." : "Generate Report"}</button><button disabled={!!exporting} onClick={() => exportReport("/reports/fields/export/pdf/", "field_report.pdf", "application/pdf")} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">{exporting === "field_report.pdf" ? "Exporting..." : "Export PDF"}</button><button disabled={!!exporting} onClick={() => exportReport("/reports/fields/export/excel/", "field_report.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")} className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">{exporting === "field_report.xlsx" ? "Exporting..." : "Export Excel"}</button></div></div>
    {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

    <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-gray-900">Filters</h2><p className="text-sm text-gray-500">Filter fields by operator, status, location, and production date.</p></div><button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-800">Clear Filters</button></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5"><label className="text-sm font-medium text-gray-700">Operator<select value={filters.operator} onChange={(event) => updateFilter("operator", event.target.value)} className={selectClass}><option value="">All Operators</option>{operators.map((operator) => <option key={operator.id} value={operator.id}>{operator.short_name || operator.name}</option>)}</select></label><label className="text-sm font-medium text-gray-700">Status<select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)} className={selectClass}><option value="">All Statuses</option>{STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label><label className="text-sm font-medium text-gray-700">Location<input value={filters.location} onChange={(event) => updateFilter("location", event.target.value)} placeholder="City" className={selectClass} /></label><label className="text-sm font-medium text-gray-700">Date From<input type="date" value={filters.date_from} onChange={(event) => updateFilter("date_from", event.target.value)} className={selectClass} /></label><label className="text-sm font-medium text-gray-700">Date To<input type="date" value={filters.date_to} onChange={(event) => updateFilter("date_to", event.target.value)} className={selectClass} /></label></div></div>

    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">{[["Total Fields", report.summary?.total_fields, "text-gray-900"], ["Active Fields", report.summary?.active_fields, "text-green-600"], ["Total Wells", report.summary?.total_wells, "text-blue-600"], ["Producing Wells", report.summary?.producing_wells, "text-indigo-600"], ["Total Operators", report.summary?.total_operators, "text-purple-600"]].map(([label, value, color]) => <div key={label} className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className={`mt-2 text-2xl font-bold ${color}`}>{number(value)}</p></div>)}</div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2"><PieCard title="Fields by Status" data={statusData} keyName="status" /><BarCard title="Fields by Operator" data={operatorData} keyName="operator" color="#7c3aed" /><BarCard title="Fields by Location" data={locationData} keyName="location" color="#0ea5e9" /><BarCard title="Wells by Field" data={fieldData} keyName="field" color="#2563eb" /><PieCard title="Well Type Distribution" data={wellTypeData} keyName="well_type" />{productionData.length > 0 && <div className="rounded-xl border bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold">Production by Field</h2><div className="h-[320px]"><ResponsiveContainer width="100%" height="100%"><BarChart data={productionData} margin={{ bottom: 60 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="field" angle={-35} textAnchor="end" interval={0} /><YAxis /><Tooltip /><Legend /><Bar dataKey="oil" name="Oil" fill="#16a34a" /><Bar dataKey="gas" name="Gas" fill="#2563eb" /><Bar dataKey="water" name="Water" fill="#0891b2" /></BarChart></ResponsiveContainer></div></div>}</div>

    <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold">Field Inventory</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr className="border-b text-left"><th className="p-4">Field</th><th className="p-4">Code</th><th className="p-4">Operator</th><th className="p-4">Country</th><th className="p-4">State</th><th className="p-4">City</th><th className="p-4">Status</th><th className="p-4">Wells</th><th className="p-4">Producing</th><th className="p-4">Shut In</th><th className="p-4">Drilling</th></tr></thead><tbody>{(report.history || []).map((item) => <tr key={item.id} className="border-b hover:bg-gray-50"><td className="p-4 font-medium">{item.name || "-"}</td><td className="p-4">{item.code || "-"}</td><td className="p-4">{item.operator || "-"}</td><td className="p-4">{item.country || "-"}</td><td className="p-4">{item.state || "-"}</td><td className="p-4">{item.city || "-"}</td><td className="p-4">{item.status || "-"}</td><td className="p-4">{item.well_count ?? 0}</td><td className="p-4">{item.producing_wells ?? 0}</td><td className="p-4">{item.shut_in_wells ?? 0}</td><td className="p-4">{item.drilling_wells ?? 0}</td></tr>)}{!(report.history || []).length && <tr><td colSpan="11" className="p-10 text-center text-gray-500">No field data available.</td></tr>}</tbody></table></div></div>
  </div>;
}
