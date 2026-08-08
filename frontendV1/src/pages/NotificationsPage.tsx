import { useEffect, useState } from "react";
import { CheckCheck, CircleAlert, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from "../services/notifications";
import Pagination from "../components/common/Pagination";

const TYPES = ["production", "measurement", "well", "maintenance", "intervention", "well_test", "system"];
const SEVERITIES = ["info", "warning", "critical", "success"];

function icon(severity: NotificationItem["severity"]) {
  if (severity === "critical") {
    return <CircleAlert size={18} className="text-red-500" />;
  }

  if (severity === "warning") {
    return <CircleAlert size={18} className="text-amber-500" />;
  }

  if (severity === "success") {
    return <CheckCheck size={18} className="text-green-500" />;
  }

  return <Info size={18} className="text-blue-500" />;
}

export default function NotificationsPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<NotificationItem[]>([]);
  const [count, setCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [filters, setFilters] = useState({
    type: "",
    severity: "",
    is_read: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const params: Record<string, string | number> = {
        page,
        page_size: pageSize,
      };

      if (filters.type) params.type = filters.type;
      if (filters.severity) params.severity = filters.severity;
      if (filters.is_read) params.is_read = filters.is_read;

      const response = await getNotifications(params);

      setItems(response.results || []);
      setCount(response.count || 0);
      setUnreadCount(response.unread_count || 0);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, pageSize, filters]);

  const markRead = async (item: NotificationItem) => {
    try {
      if (!item.is_read) {
        await markNotificationRead(item.id);

        setItems((current) =>
          current.map((entry) =>
            entry.id === item.id
              ? { ...entry, is_read: true }
              : entry
          )
        );

        setUnreadCount((value) => Math.max(0, value - 1));
      }

      if (item.url) {
        navigate(item.url);
      }
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  const markAll = async () => {
    try {
      await markAllNotificationsRead();

      setItems((current) =>
        current.map((item) => ({
          ...item,
          is_read: true,
        }))
      );

      setUnreadCount(0);
    } catch (err) {
      setError("Failed to mark all notifications read.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Stay updated with activity across Wellora.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void markAll()}
          disabled={loading || unreadCount === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3 dark:border-slate-700 dark:bg-slate-900">
        <select
          value={filters.type}
          onChange={(event) => {
            setFilters((current) => ({
              ...current,
              type: event.target.value,
            }));
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="">All types</option>

          {TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          value={filters.severity}
          onChange={(event) => {
            setFilters((current) => ({
              ...current,
              severity: event.target.value,
            }));
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="">All severities</option>

          {SEVERITIES.map((severity) => (
            <option key={severity} value={severity}>
              {severity}
            </option>
          ))}
        </select>

        <select
          value={filters.is_read}
          onChange={(event) => {
            setFilters((current) => ({
              ...current,
              is_read: event.target.value,
            }));
            setPage(1);
          }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="">All notifications</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Notifications */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No notifications.
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => void markRead(item)}
              className={`flex w-full items-start gap-4 border-b border-slate-100 p-5 text-left transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                item.is_read ? "opacity-70" : ""
              }`}
            >
              <span className="mt-0.5">
                {icon(item.severity)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </span>

                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase text-slate-500 dark:bg-slate-800">
                    {item.type.replace("_", " ")}
                  </span>
                </span>

                <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">
                  {item.message}
                </span>

                <span className="mt-2 block text-xs text-slate-400">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </span>

              {!item.is_read && (
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
              )}
            </button>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>
          {unreadCount} unread
        </span>

        <Pagination
          page={page}
          pageSize={pageSize}
          total={count}
          onPageChange={(nextPage) => setPage(nextPage)}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
          loading={loading}
        />
      </div>
    </div>
  );
}