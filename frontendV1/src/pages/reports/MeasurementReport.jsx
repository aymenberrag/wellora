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

const SHIFTS = ["Day", "Night"];
const OPERATING_STATUSES = ["Running", "Shut In", "Maintenance", "Startup", "Shutdown"];
const COLORS = ["#2563eb", "#16a34a", "#eab308", "#dc2626", "#9333ea", "#0891b2"];
const EMPTY_REPORT = {
  summary: {}, pressure_history: [], temperature_history: [], choke_history: [],
  esp_history: [], status_distribution: [], shift_distribution: [], history: [],
};

export default function MeasurementReport() {
  const [fields, setFields] = useState([]);
  const [wells, setWells] = useState([]);
  const [report, setReport] = useState(EMPTY_REPORT);
  const [filters, setFilters] = useState({ field: "", well: "", date_from: "", date_to: "", shift: "", operating_status: "" });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState("");
  const [error, setError] = useState("");

  const loadFields = async () => { try { const response = await api.get("/fields/"); setFields(response.data?.results || response.data || []); } catch (err) { console.error("Failed to load fields:", err); setFields([]); } };
  const loadWells = async (field = "") => { try { const response = await api.get("/wells/", { params: field ? { field } : {} }); setWells(response.data?.results || response.data || []); } catch (err) { console.error("Failed to load wells:", err); setWells([]); } };
  const loadReport = async () => {
    try {
      setLoading(true); setError("");
      const response = await api.get("/reports/measurements/", { params: filters });
      setReport({ ...EMPTY_REPORT, ...(response.data || {}), summary: response.data?.summary || {}, pressure_history: response.data?.pressure_history || [], temperature_history: response.data?.temperature_history || [], choke_history: response.data?.choke_history || [], esp_history: response.data?.esp_history || [], status_distribution: response.data?.status_distribution || [], shift_distribution: response.data?.shift_distribution || [], history: response.data?.history || [] });
    } catch (err) { console.error("Failed to load measurement report:", err); setError(err.response?.data?.error || "Failed to load measurement report."); } finally { setLoading(false); }
  };
  const exportReport = async (path, filename, type) => {
    try {
      setExporting(filename);
      const response = await api.get(path, { params: filters, responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data], { type }));
      const link = document.createElement("a"); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url);
    } catch (err) { console.error(`Failed to export ${filename}:`, err); setError(`Failed to export ${filename}.`); } finally { setExporting(""); }
  };
  useEffect(() => { loadFields(); loadReport(); }, []);
  useEffect(() => { loadWells(filters.field); }, [filters.field]);
  const updateFilter = (name, value) => setFilters((previous) => ({ ...previous, [name]: value, ...(name === "field" ? { well: "" } : {}) }));
  const clearFilters = () => setFilters({ field: "", well: "", date_from: "", date_to: "", shift: "", operating_status: "" });
  const pressure = useMemo(() => report.pressure_history || [], [report.pressure_history]);
  const temperature = useMemo(() => report.temperature_history || [], [report.temperature_history]);
  const choke = useMemo(() => report.choke_history || [], [report.choke_history]);
  const esp = useMemo(() => report.esp_history || [], [report.esp_history]);
  const statuses = useMemo(() => report.status_distribution || [], [report.status_distribution]);
  const shifts = useMemo(() => report.shift_distribution || [], [report.shift_distribution]);
  const number = (value) => Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const selectClass = "mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500";

  const ChartCard = ({ title, data, lines, height = "h-[320px]" }) => <div className="rounded-xl border bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold">{title}</h2><div className={height}>{data.length ? <ResponsiveContainer width="100%" height="100%"><LineChart data={data} margin={{ bottom: 20 }}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend />{lines.map((line) => <Line key={line.key} type="monotone" dataKey={line.key} name={line.name} stroke={line.color} strokeWidth={3} dot={{ r: 3 }} connectNulls />)}</LineChart></ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-gray-500">No measurement data available.</div>}</div></div>;
  const DistributionCard = ({ title, data, keyName, horizontal = false }) => <div className="rounded-xl border bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold">{title}</h2><div className="h-[320px]">{data.length ? <ResponsiveContainer width="100%" height="100%">{horizontal ? <BarChart data={data} layout="vertical" margin={{ left: 20 }}><CartesianGrid strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} /><YAxis type="category" dataKey={keyName} width={100} /><Tooltip /><Bar dataKey="count" fill="#2563eb" radius={[0, 6, 6, 0]} /></BarChart> : <PieChart><Pie data={data} dataKey="count" nameKey={keyName} cx="50%" cy="50%" outerRadius={110} label>{data.map((item, index) => <Cell key={item[keyName]} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart>}</ResponsiveContainer> : <div className="flex h-full items-center justify-center text-sm text-gray-500">No measurement data available.</div>}</div></div>;
  const cards = [["Total Measurements", report.summary?.total_measurements, ""], ["Average WHP", report.summary?.average_wellhead_pressure, "psi"], ["Average Tubing Pressure", report.summary?.average_tubing_head_pressure, "psi"], ["Average Casing Pressure", report.summary?.average_casing_pressure, "psi"], ["Average Flowline Pressure", report.summary?.average_flowline_pressure, "psi"], ["Average Temperature", report.summary?.average_temperature, "°C"], ["Average Choke Size", report.summary?.average_choke_size, "1/64 in"], ["Average ESP Frequency", report.summary?.average_esp_frequency, "Hz"], ["Average Motor Current", report.summary?.average_motor_current, "A"]];

  return <div className="min-h-screen bg-gray-50 p-6">
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h1 className="text-2xl font-bold text-gray-900">Measurement Report</h1><p className="mt-1 text-sm text-gray-500">Analyze pressures, temperatures, artificial lift, and operating conditions.</p></div><div className="flex flex-wrap gap-3"><button onClick={loadReport} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? "Loading..." : "Generate Report"}</button><button disabled={!!exporting} onClick={() => exportReport("/reports/measurements/export/pdf/", "measurement_report.pdf", "application/pdf")} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">{exporting === "measurement_report.pdf" ? "Exporting..." : "Export PDF"}</button><button disabled={!!exporting} onClick={() => exportReport("/reports/measurements/export/excel/", "measurement_report.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")} className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">{exporting === "measurement_report.xlsx" ? "Exporting..." : "Export Excel"}</button></div></div>
    {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm"><div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-gray-900">Filters</h2><p className="text-sm text-gray-500">Filter measurements by well, date, shift, and operating status.</p></div><button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-800">Clear Filters</button></div><div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"><label className="text-sm font-medium text-gray-700">Field<select value={filters.field} onChange={(event) => updateFilter("field", event.target.value)} className={selectClass}><option value="">All Fields</option>{fields.map((field) => <option key={field.id} value={field.id}>{field.name} {field.code ? `(${field.code})` : ""}</option>)}</select></label><label className="text-sm font-medium text-gray-700">Well<select value={filters.well} onChange={(event) => updateFilter("well", event.target.value)} className={selectClass}><option value="">All Wells</option>{wells.map((well) => <option key={well.id} value={well.id}>{well.code} - {well.name}</option>)}</select></label><label className="text-sm font-medium text-gray-700">Date From<input type="date" value={filters.date_from} onChange={(event) => updateFilter("date_from", event.target.value)} className={selectClass} /></label><label className="text-sm font-medium text-gray-700">Date To<input type="date" value={filters.date_to} onChange={(event) => updateFilter("date_to", event.target.value)} className={selectClass} /></label><label className="text-sm font-medium text-gray-700">Shift<select value={filters.shift} onChange={(event) => updateFilter("shift", event.target.value)} className={selectClass}><option value="">All Shifts</option>{SHIFTS.map((shift) => <option key={shift} value={shift}>{shift}</option>)}</select></label><label className="text-sm font-medium text-gray-700">Operating Status<select value={filters.operating_status} onChange={(event) => updateFilter("operating_status", event.target.value)} className={selectClass}><option value="">All Statuses</option>{OPERATING_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}</select></label></div></div>
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{cards.map(([label, value, unit]) => <div key={label} className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-bold text-gray-900">{number(value)}</p>{unit && <p className="mt-1 text-xs text-gray-400">{unit}</p>}</div>)}</div>
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2"><div className="xl:col-span-2"><ChartCard title="Pressure Analysis" data={pressure} lines={[{ key: "wellhead_pressure", name: "Wellhead Pressure", color: "#2563eb" }, { key: "casing_pressure", name: "Casing Pressure", color: "#dc2626" }]} /></div><ChartCard title="Temperature Analysis" data={temperature} lines={[{ key: "wellhead_temperature", name: "Wellhead Temperature", color: "#f97316" }, { key: "flowline_temperature", name: "Flowline Temperature", color: "#eab308" }]} /><ChartCard title="Choke Size Trend" data={choke} lines={[{ key: "choke_size", name: "Choke Size", color: "#7c3aed" }]} /><div className="xl:col-span-2"><ChartCard title="Artificial Lift Performance" data={esp} lines={[{ key: "esp_frequency", name: "ESP Frequency", color: "#16a34a" }, { key: "motor_current", name: "Motor Current", color: "#0891b2" }]} /></div><DistributionCard title="Operating Status Distribution" data={statuses} keyName="status" /><DistributionCard title="Measurements by Shift" data={shifts} keyName="shift" horizontal /></div>
    <div className="mt-6 rounded-xl border bg-white p-6 shadow-sm"><h2 className="mb-5 text-lg font-semibold">Measurement History</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr className="border-b text-left"><th className="p-4">Date</th><th className="p-4">Well</th><th className="p-4">Field</th><th className="p-4">Shift</th><th className="p-4">Status</th><th className="p-4">WHP</th><th className="p-4">Casing</th><th className="p-4">Temperature</th><th className="p-4">Choke</th><th className="p-4">ESP</th><th className="p-4">Motor</th><th className="p-4">Recorded By</th></tr></thead><tbody>{(report.history || []).map((item, index) => <tr key={`${item.id}-${index}`} className="border-b hover:bg-gray-50"><td className="p-4">{item.date || "-"}</td><td className="p-4 font-medium">{item.well || "-"}</td><td className="p-4">{item.field || "-"}</td><td className="p-4">{item.shift || "-"}</td><td className="p-4">{item.operating_status || "-"}</td><td className="p-4">{item.wellhead_pressure ?? "-"}</td><td className="p-4">{item.casing_pressure ?? "-"}</td><td className="p-4">{item.wellhead_temperature ?? "-"}</td><td className="p-4">{item.choke_size ?? "-"}</td><td className="p-4">{item.esp_frequency ?? "-"}</td><td className="p-4">{item.motor_current ?? "-"}</td><td className="p-4">{item.recorded_by || "-"}</td></tr>)}{!(report.history || []).length && <tr><td colSpan="12" className="p-10 text-center text-gray-500">No measurement data available.</td></tr>}</tbody></table></div></div>
  </div>;
}
