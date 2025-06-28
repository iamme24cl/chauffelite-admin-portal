import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Reservations", path: "/rides" },
  { name: "Drivers", path: "/drivers" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Settings", path: "/settings" },
  { name: "Flight Check", path: "/flight-check" },
];

export default function Header() {
  const { logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-md md:hidden">
      <div className="px-4 py-4 w-full">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-800 truncate">ChauffElite Partner</h1>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-2xl text-gray-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="bg-white border-t px-4 pb-4 w-full">
          <div className="max-w-screen-xl mx-auto space-y-2 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "block text-blue-600 font-semibold"
                    : "block text-gray-700 hover:text-blue-600"
                }
              >
                {item.name}
              </NavLink>
            ))}
            <button
              onClick={logout}
              className="block mt-4 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
