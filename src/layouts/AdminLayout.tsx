import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} bg-black bg-opacity-50`}>
        <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-lg p-4">
          <Sidebar />
          <button
            className="mt-4 text-sm text-gray-500"
            onClick={() => setSidebarOpen(false)}
          >
            Close Menu
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block md:w-64 bg-white border-r p-4">
        <Sidebar />
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
