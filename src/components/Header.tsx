import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Drivers", path: "/drivers" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Rides", path: "/rides" },
  { name: "Settings", path: "/settings" },
];

export default function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-md md:hidden">
      <div className="px-4 py-4 flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">LuxRide Admin</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-2xl text-gray-600"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <nav className="bg-white border-t px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block text-blue-600 font-semibold"
                  : "block text-gray-600 hover:text-blue-600"
              }
            >
              {item.name}
            </NavLink>
          ))}
          <button
            onClick={logout}
            className="block mt-4 text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </nav>
      )}
    </header>
  );
}
