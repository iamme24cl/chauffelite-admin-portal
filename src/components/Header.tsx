import { useAuth } from "../context/AuthContext";

export default function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const { logout } = useAuth();

  return (
    <header className="bg-white border-b px-4 sm:px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-600"
          aria-label="Open sidebar"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Admin Portal</h1>
      </div>
      <button onClick={logout} className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
        Sign Out
      </button>
    </header>
  );
}

