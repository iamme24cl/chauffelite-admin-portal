import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 bg-white border-r">
        <Sidebar />
      </aside>

      {/* Sidebar drawer (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-0 left-0 h-full w-64 bg-white p-4 shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar />
            <button
              onClick={() => setSidebarOpen(false)}
              className="mt-4 text-sm text-gray-600"
            >
              Close Menu
            </button>
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Header (mobile only) */}
        <div className="md:hidden">
          <Header toggleSidebar={() => setSidebarOpen(true)} />
        </div>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 max-w-screen-xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
