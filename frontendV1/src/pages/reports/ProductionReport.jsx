import { useEffect, useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import api from "../../services/api";

const EMPTY_REPORT = { summary: {}, daily_production: [], top_wells: [] };

export default function ProductionReport() {
  const [fields, setFields] = useState([]);
  const [wells, setWells] = useState([]);
  const [report, setReport] = useState(EMPTY_REPORT);
  const [filters, setFilters] = useState({ field: "", well: "", date_from: "", date_to: "" });
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState("");
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

  const loadWells = async (field = "") => {
    try {
      const response = await api.get("/wells/", { params: field ? { field } : {} });
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
      const response = await api.get("/reports/production/", { params: filters });
      setReport({
        ...EMPTY_REPORT,
        ...(response.data || {}),
        summary: response.data?.summary || {},
        daily_production: response.data?.daily_production || [],
        top_wells: response.data?.top_wells || [],
      });
    } catch (err) {
      console.error("Failed to load production report:", err);
      setError(err.response?.data?.error || "Failed to load production report.");
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

  useEffect(() => { loadFields(); loadReport(); }, []);
  useEffect(() => { loadWells(filters.field); }, [filters.field]);

  const updateFilter = (name, value) => setFilters((previous) => ({
    ...previous,
    [name]: value,
    ...(name === "field" ? { well: "" } : {}),
  }));

  const clearFilters = () => setFilters({ field: "", well: "", date_from: "", date_to: "" });
  const daily = useMemo(() => report.daily_production || [], [report.daily_production]);
  const topWells = useMemo(() => report.top_wells || [], [report.top_wells]);
  const number = (value) => Number(value || 0).toLocaleString(undefined, { maximumFractionDigits: 2 });

  const chart = daily.length ? (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={daily} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis />
        <Tooltip formatter={(value) => number(value)} /><Legend />
        <Line type="monotone" dataKey="oil" name="Oil (BOPD)" stroke="#16a34a" strokeWidth={3} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="gas" name="Gas (MSCFD)" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }} />
        <Line type="monotone" dataKey="water" name="Water (BWPD)" stroke="#0891b2" strokeWidth={3} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  ) : <div className="flex h-full items-center justify-center text-sm text-gray-500">No production data available.</div>;

  const SelectField = ({ label, children }) => <label className="text-sm font-medium text-gray-700">{label}{children}</label>;
  const selectClass = "mt-1 w-full rounded-lg border px-3 py-2.5 font-normal outline-none focus:border-blue-500";

  return <div className="min-h-screen bg-gray-50 p-6">
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div><h1 className="text-2xl font-bold text-gray-900">Production Report</h1><p className="mt-1 text-sm text-gray-500">Analyze oil, gas, water, and well production performance.</p></div>
      <div className="flex flex-wrap gap-3">
        <button onClick={loadReport} disabled={loading} className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{loading ? "Loading..." : "Generate Report"}</button>
        <button disabled={!!exporting} onClick={() => exportReport("/reports/production/pdf/", "production_report.pdf", "application/pdf")} className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">{exporting === "production_report.pdf" ? "Exporting..." : "Export PDF"}</button>
        <button disabled={!!exporting} onClick={() => exportReport("/reports/production/export/excel/", "production_report.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")} className="rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">{exporting === "production_report.xlsx" ? "Exporting..." : "Export Excel"}</button>
      </div>
    </div>
    {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

    <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between"><div><h2 className="text-lg font-semibold text-gray-900">Filters</h2><p className="text-sm text-gray-500">Filter production records.</p></div><button onClick={clearFilters} className="text-sm font-medium text-blue-600 hover:text-blue-800">Clear Filters</button></div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SelectField label="Field"><select value={filters.field} onChange={(event) => updateFilter("field", event.target.value)} className={selectClass}><option value="">All Fields</option>{fields.map((field) => <option key={field.id} value={field.id}>{field.name} {field.code ? `(${field.code})` : ""}</option>)}</select></SelectField>
        <SelectField label="Well"><select value={filters.well} onChange={(event) => updateFilter("well", event.target.value)} className={selectClass}><option value="">All Wells</option>{wells.map((well) => <option key={well.id} value={well.id}>{well.code} - {well.name}</option>)}</select></SelectField>
        <SelectField label="Date From"><input type="date" value={filters.date_from} onChange={(event) => updateFilter("date_from", event.target.value)} className={selectClass} /></SelectField>
        <SelectField label="Date To"><input type="date" value={filters.date_to} onChange={(event) => updateFilter("date_to", event.target.value)} className={selectClass} /></SelectField>
      </div>
    </div>

    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[["Total Oil", report.summary?.total_oil, "BOPD", "text-green-600"], ["Total Gas", report.summary?.total_gas, "MSCFD", "text-blue-600"], ["Total Water", report.summary?.total_water, "BWPD", "text-cyan-600"], ["Records", report.summary?.total_records, "Production records", "text-gray-900"]].map(([label, value, unit, color]) => <div key={label} className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className={`mt-2 text-2xl font-bold ${color}`}>{number(value)}</p><p className="mt-1 text-xs text-gray-400">{unit}</p></div>)}
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
      <div className="rounded-xl border bg-white p-6 shadow-sm xl:col-span-2"><h2 className="mb-5 text-lg font-semibold">Production Trends</h2><div className="h-[350px]">{chart}</div></div>
      <div className="rounded-xl border bg-white p-6 shadow-sm xl:col-span-2"><h2 className="mb-5 text-lg font-semibold">Daily Production</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr className="border-b text-left"><th className="p-4">Date</th><th className="p-4">Oil (BOPD)</th><th className="p-4">Gas (MSCFD)</th><th className="p-4">Water (BWPD)</th></tr></thead><tbody>{daily.map((item) => <tr key={item.date} className="border-b hover:bg-gray-50"><td className="p-4">{item.date || "-"}</td><td className="p-4">{number(item.oil)}</td><td className="p-4">{number(item.gas)}</td><td className="p-4">{number(item.water)}</td></tr>)}{!daily.length && <tr><td colSpan="4" className="p-10 text-center text-gray-500">No production data available.</td></tr>}</tbody></table></div></div>
      <div className="rounded-xl border bg-white p-6 shadow-sm xl:col-span-2"><h2 className="mb-5 text-lg font-semibold">Top Producing Wells</h2><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50"><tr className="border-b text-left"><th className="p-4">Well</th><th className="p-4">Name</th><th className="p-4">Oil</th><th className="p-4">Gas</th><th className="p-4">Water</th></tr></thead><tbody>{topWells.map((well) => <tr key={well.well_id || well.well_code} className="border-b hover:bg-gray-50"><td className="p-4 font-medium">{well.well_code || "-"}</td><td className="p-4">{well.well_name || "-"}</td><td className="p-4">{number(well.oil)}</td><td className="p-4">{number(well.gas)}</td><td className="p-4">{number(well.water)}</td></tr>)}{!topWells.length && <tr><td colSpan="5" className="p-10 text-center text-gray-500">No production data available.</td></tr>}</tbody></table></div></div>
    </div>
  </div>;
}
