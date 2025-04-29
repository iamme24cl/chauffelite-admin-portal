import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/" },
  { name: "Drivers", path: "/drivers" },
  { name: "Vehicles", path: "/vehicles" },
  { name: "Rides", path: "rides" }, 
  { name: "Settings", path: "/settings" } 
]

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-8">LuxRide Admin</h2>
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
    </aside>
  );
}
