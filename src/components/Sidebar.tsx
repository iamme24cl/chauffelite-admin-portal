import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  Car,
  Settings,
  Plane,
  LogOut,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Reservations", path: "/rides", icon: CalendarCheck },
  { name: "Drivers", path: "/drivers", icon: Users },
  { name: "Vehicles", path: "/vehicles", icon: Car },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Flight Check", path: "/flight-check", icon: Plane },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="hidden md:flex fixed top-0 left-0 w-64 h-screen bg-white border-r shadow-sm flex-col z-40">
      {/* Header */}
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">ChauffElite Partner</h2>
      </div>

      {/* Navigation links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {links.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {name}
            </Link>
          );
        })}
      </div>

      {/* Sign Out */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
