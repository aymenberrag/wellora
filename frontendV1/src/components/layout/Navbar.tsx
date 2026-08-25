import { Menu, MapPinned } from "lucide-react";
import { NavLink } from "react-router-dom";
import GlobalSearch from "./GlobalSearch";
import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";
import { storage } from "../../services/storage";
import { canAccess } from "../../utils/permissions";

export default function Navbar() {
  const user = storage.getUser();
  const canViewMap = canAccess(user, "wells", "view");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <button className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden" aria-label="Open navigation menu"><Menu size={22} /></button>
        <div className="hidden min-w-0 flex-1 md:block"><GlobalSearch /></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="md:hidden"><GlobalSearch /></div>
        {canViewMap && (
          <NavLink
            to="/map"
            aria-label="Well Map"
            title="Well Map"
            className={({ isActive }) =>
              `rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 ${
                isActive ? "bg-blue-50 text-blue-600 dark:bg-blue-950" : ""
              }`
            }
          >
            <MapPinned size={20} />
          </NavLink>
        )}
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}
