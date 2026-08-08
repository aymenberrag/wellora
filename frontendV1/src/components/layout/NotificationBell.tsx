import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, CircleAlert, Info, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAllNotificationsRead, markNotificationRead, type NotificationItem } from "../../services/notifications";

const severityIcon = {
  critical: <CircleAlert size={16} className="text-red-500" />,
  warning: <CircleAlert size={16} className="text-amber-500" />,
  success: <CheckCheck size={16} className="text-green-500" />,
  info: <Info size={16} className="text-blue-500" />,
};

function relativeTime(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await getNotifications({ page: 1, page_size: 8 });
      setItems(response.results || []);
      setUnreadCount(response.unread_count || 0);
      setError("");
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Unable to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 45000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("mousedown", handleOutside); document.removeEventListener("keydown", handleEscape); };
  }, []);

  const openNotification = async (item: NotificationItem) => {
    if (!item.is_read) {
      try { await markNotificationRead(item.id); setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, is_read: true } : entry)); setUnreadCount((count) => Math.max(0, count - 1)); } catch (err) { console.error("Failed to mark notification read:", err); }
    }
    setOpen(false);
    if (item.url) navigate(item.url);
  };

  const markAll = async () => {
    try { await markAllNotificationsRead(); setItems((current) => current.map((item) => ({ ...item, is_read: true }))); setUnreadCount(0); } catch (err) { console.error("Failed to mark all notifications read:", err); }
  };

  return <div ref={rootRef} className="relative"><button onClick={() => setOpen((value) => !value)} className="relative rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Notifications" aria-expanded={open}><Bell size={20} />{unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">{unreadCount > 99 ? "99+" : unreadCount}</span>}</button>{open && <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900"><div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800"><h3 className="font-semibold text-slate-900 dark:text-slate-100">Notifications</h3><button onClick={markAll} disabled={!unreadCount} className="text-xs font-medium text-blue-600 disabled:text-slate-400">Mark all read</button></div>{loading ? <p className="p-6 text-center text-sm text-slate-500">Loading notifications...</p> : error ? <p className="p-6 text-center text-sm text-red-600">{error}</p> : items.length === 0 ? <p className="p-6 text-center text-sm text-slate-500">No notifications.</p> : <div className="max-h-[min(24rem,60vh)] overflow-y-auto">{items.map((item) => <button key={item.id} onClick={() => void openNotification(item)} className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${item.is_read ? "opacity-70" : ""}`}><span className="mt-0.5">{severityIcon[item.severity] || <Wrench size={16} />}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</span><span className="mt-0.5 block text-xs text-slate-500">{item.message}</span><span className="mt-1 block text-[11px] text-slate-400">{relativeTime(item.created_at)}</span></span>{!item.is_read && <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />}</button>)}</div>}<button onClick={() => { setOpen(false); navigate("/notifications"); }} className="flex w-full items-center justify-center gap-1 px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">View all notifications →</button></div>}</div>;
}
