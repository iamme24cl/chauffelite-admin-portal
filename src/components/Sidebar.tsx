import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { name: "Dashboard", path: "/" },
  { name: "Reservations", path: "/rides" },
  { name: "Drivers", path: "/drivers" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Settings", path: "/settings" },
  { name: "Flight Check", path: "/flight-check" },
];

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="flex flex-col h-full">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-8">ChauffElite Partner</h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-4 py-2 rounded ${
                location.pathname === link.path
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
        <div className="mt-auto p-4 border-t">
          <button
            onClick={logout}
            className="w-full text-center text-sm text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
    </aside>
  );
}
