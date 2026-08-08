import { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setOpenProfile(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">

      {/* Left */}

      <div className="flex items-center gap-4">

        <button className="rounded-lg p-2 hover:bg-slate-100 lg:hidden">
          <Menu size={22} />
        </button>

        <div className="relative hidden md:block">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            placeholder="Search..."
            className="w-80 rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <button className="relative rounded-xl p-2 hover:bg-slate-100">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-xl p-2 hover:bg-slate-100"
        >
          {darkMode ? (
            <Sun size={20} />
          ) : (
            <Moon size={20} />
          )}
        </button>

        {/* Profile */}

        <div
          ref={profileRef}
          className="relative"
        >
          <button
            onClick={() =>
              setOpenProfile(!openProfile)
            }
            className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-semibold">
              A
            </div>

            <div className="hidden text-left md:block">

              <h4 className="font-semibold">
                Aymen
              </h4>

              <p className="text-xs text-slate-500">
                Production Engineer
              </p>

            </div>

            <ChevronDown size={18} />

          </button>

          {openProfile && (
            <div className="absolute right-0 mt-3 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">

              <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-100">

                <User size={18} />

                My Profile

              </button>

              <button className="flex w-full items-center gap-3 px-4 py-3 hover:bg-slate-100">

                <Settings size={18} />

                Settings

              </button>

              <hr />

              <button className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50">

                <LogOut size={18} />

                Logout

              </button>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}