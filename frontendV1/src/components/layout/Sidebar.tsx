import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Map,
  Droplets,
  Activity,
  FlaskConical,
  BarChart3,
  Wrench,
  ShieldAlert,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Companies", icon: Building2, path: "/companies" },
  { name: "Fields", icon: Map, path: "/fields" },
  { name: "Wells", icon: Droplets, path: "/wells" },
  { name: "Measurements", icon: Activity, path: "/measurements" },
  { name: "Well Tests", icon: FlaskConical, path: "/well-tests" },
  { name: "Production", icon: BarChart3, path: "/production" },
  { name: "Maintenance", icon: Wrench, path: "/maintenance" },
  { name: "Interventions", icon: ShieldAlert, path: "/interventions" },
  { name: "Reports", icon: FileText, path: "/reports" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-5">
        {!collapsed && (
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Wellora</h1>
            <p className="text-xs text-slate-500">
              Enterprise Well Management
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 transition hover:bg-slate-100"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon size={collapsed ? 26 : 20} />

                  {!collapsed && (
                    <span className="font-medium">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User */}
      <div className="border-t border-slate-200 p-4">
        {collapsed ? (
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
            A
          </div>
        ) : (
          <div className="rounded-xl bg-slate-100 p-4">
            <h3 className="font-semibold">Aymen</h3>

            <p className="text-sm text-slate-500">
              Production Engineer
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}