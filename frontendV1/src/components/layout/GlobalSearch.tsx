import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

type SearchResult = {
  type: string;
  id: number;
  title: string;
  subtitle: string;
  url: string;
};

export default function GlobalSearch() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const value = query.trim();
    if (!value) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const response = await api.get<{ results: SearchResult[] }>("/search/", { params: { q: value } });
        setResults(response.data?.results || []);
      } catch (error) {
        console.error("Global search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const goToResult = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(result.url);
  };

  return (
    <div ref={rootRef} className="relative w-full max-w-md">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && results[0]) goToResult(results[0]);
        }}
        placeholder="Search wells, fields, production..."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:bg-slate-900"
        aria-label="Global search"
      />

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {loading && <p className="px-3 py-4 text-sm text-slate-500">Searching...</p>}
          {!loading && results.map((result) => (
            <button key={`${result.type}-${result.id}`} onClick={() => goToResult(result)} className="flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800">
              <span className="mt-0.5 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase text-blue-700 dark:bg-blue-950 dark:text-blue-300">{result.type}</span>
              <span className="min-w-0"><span className="block truncate font-medium text-slate-900 dark:text-slate-100">{result.title}</span><span className="block truncate text-xs text-slate-500">{result.subtitle}</span></span>
            </button>
          ))}
          {!loading && results.length === 0 && <p className="px-3 py-4 text-sm text-slate-500">No results found.</p>}
        </div>
      )}
    </div>
  );
}
