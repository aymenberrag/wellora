import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, Moon, Settings, Sun, User as UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function UserMenu() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { resolvedTheme, toggleTheme } = useTheme();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim() || user?.username || "User";
  const initials = fullName.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  useEffect(() => {
    const handleOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button onClick={() => setOpen((value) => !value)} className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" aria-expanded={open}>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">{initials || <UserIcon size={18} />}</div>
        <div className="hidden text-left md:block"><h4 className="font-semibold text-slate-900 dark:text-slate-100">{fullName}</h4><p className="text-xs text-slate-500">{user?.job_title || "Wellora User"}</p></div>
        <ChevronDown size={18} className="text-slate-500" />
      </button>

      {open && <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-800"><p className="font-semibold text-slate-900 dark:text-slate-100">{fullName}</p><p className="text-xs text-slate-500">{user?.job_title || "Wellora User"}</p></div>
        <button onClick={() => { setOpen(false); navigate("/profile"); }} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"><UserIcon size={18} /> Profile</button>
        <button onClick={() => { setOpen(false); navigate("/settings"); }} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"><Settings size={18} /> Settings</button>
        <button onClick={toggleTheme} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">{resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />} {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</button>
        <div className="border-t border-slate-100 dark:border-slate-800">
          {!confirmLogout ? <button onClick={() => setConfirmLogout(true)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"><LogOut size={18} /> Logout</button> : <div className="p-3"><p className="mb-3 text-sm font-medium text-slate-900 dark:text-slate-100">Sign out of Wellora?</p><div className="flex justify-end gap-2"><button onClick={() => setConfirmLogout(false)} className="rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button><button onClick={() => void logout()} className="rounded-lg bg-red-600 px-3 py-2 text-xs font-medium text-white hover:bg-red-700">Logout</button></div></div>}
        </div>
      </div>}
    </div>
  );
}
