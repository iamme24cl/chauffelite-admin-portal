import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AdminLayout() {

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-x-hidden">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block w-64 bg-white border-r">
        <Sidebar />
      </aside>

      {/* Main layout area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Header (mobile only) */}
        <div className="md:hidden">
          <Header />
        </div>

        {/* Main content wrapper */}
        <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-screen-xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
