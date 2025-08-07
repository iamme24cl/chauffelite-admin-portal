import { useEffect, useState } from "react";
import { Ride } from "../types";
import { fetchRides } from "../services/rideService";
import RideLiveModalController from "../components/RideLiveModalController";
import { formatRideStatus, formatVehicleClass } from "../utils/formatters";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ClipboardList,
  Car,
  Search,
  Download,
  List,
  Calendar,
  Filter,
  ChevronDown,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "bg-indigo-100 text-indigo-800",
  ACCEPTED: "bg-orange-100 text-orange-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-800",
};

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [vehicleClassFilter, setVehicleClassFilter] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchRides().then(setRides);
  }, []);

  const filteredRides = rides.filter((r) => {
    const matchStatus = statusFilter ? r.status === statusFilter : true;
    const matchClass = vehicleClassFilter ? r.vehicle_class === vehicleClassFilter : true;
    const matchSearch = searchText
      ? r.pickup?.address?.toLowerCase().includes(searchText.toLowerCase()) ||
        r.dropoff?.address?.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchStatus && matchClass && matchSearch;
  });

  const uniqueVehicleClasses = Array.from(new Set(rides.map((r) => r.vehicle_class).filter(Boolean)));

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Ride Reservations", 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [["Pickup", "Dropoff", "Status", "Start", "End", "Fare"]],
      body: filteredRides.map((r) => [
        r.pickup?.address || "-",
        r.dropoff?.address || "-",
        formatRideStatus(r.status),
        r.scheduled_start ? new Date(r.scheduled_start).toLocaleString() : "-",
        r.scheduled_end ? new Date(r.scheduled_end).toLocaleString() : "-",
        r.fare ? `$${r.fare.toFixed(2)}` : "N/A",
      ]),
    });
    doc.save("reservations.pdf");
  };

  return (
    <RideLiveModalController onStatusUpdate={() => fetchRides().then(setRides)}>
      {(openRideModal) => (
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-blue-700">
              <ClipboardList className="w-6 h-6" />
              <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-600">{filteredRides.length} rides</span>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-md hover:bg-gray-50"
              >
                <Filter className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700 font-medium">Filter</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              <div className="flex rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-white border border-gray-300">
                <button
                  onClick={() => setView("list")}
                  className={`px-4 py-1.5 flex items-center gap-1 text-sm font-medium ${
                    view === "list" ? "bg-white text-blue-600 shadow" : "text-gray-600"
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => setView("calendar")}
                  className={`px-4 py-1.5 flex items-center gap-1 text-sm font-medium ${
                    view === "calendar" ? "bg-white text-blue-600 shadow" : "text-gray-600"
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar
                </button>
              </div>

              <button
                onClick={exportPDF}
                className="flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 justify-start border-t pt-4">
              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {["All", "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s === "All" ? "" : s)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      statusFilter === (s === "All" ? "" : s)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {/* Vehicle Class Filter */}
              <div className="flex flex-wrap gap-2">
                {["All", ...uniqueVehicleClasses].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setVehicleClassFilter(cls === "All" ? "" : cls)}
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      vehicleClassFilter === (cls === "All" ? "" : cls)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search pickup/dropoff..."
              className="pl-10 w-full text-sm py-2 bg-transparent border-none focus:outline-none focus:ring-0"
              style={{ borderBottom: "1px solid #e5e7eb" }}
            />
          </div>

          {/* List or Calendar View */}
          {view === "list" ? (
            <div className="bg-white rounded shadow overflow-x-auto w-full">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-2 text-gray-600 font-medium">Date</th>
                    <th className="px-4 py-2 text-gray-600 font-medium">Pickup</th>
                    <th className="px-4 py-2 text-gray-600 font-medium">Dropoff</th>
                    <th className="px-4 py-2 text-gray-600 font-medium">Status</th>
                    <th className="px-4 py-2 text-gray-600 font-medium">Fare</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRides.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => openRideModal(r)}
                      className="border-t hover:bg-blue-50 cursor-pointer"
                    >
                      <td className="px-4 py-2 text-gray-800 whitespace-nowrap">
                        {r.scheduled_start
                          ? new Date(r.scheduled_start).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-700 truncate max-w-[180px]">
                        {r.pickup?.address || "-"}
                      </td>
                      <td className="px-4 py-2 text-gray-700 truncate max-w-[180px]">
                        {r.dropoff?.address || "-"}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            STATUS_COLORS[r.status] || "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {formatRideStatus(r.status)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-800 font-medium">
                        {r.fare ? `$${r.fare.toFixed(2)}` : "N/A"}
                      </td>
                    </tr>
                  ))}
                  {filteredRides.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-8">
                        No rides found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded shadow p-4 w-full">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,listWeek",
                }}
                events={filteredRides.map((ride) => ({
                  id: ride.id,
                  title: formatVehicleClass(ride.vehicle_class),
                  start: ride.scheduled_start,
                  end: ride.scheduled_end,
                  extendedProps: { status: ride.status },
                }))}
                eventClick={(info) => {
                  const ride = rides.find((r) => r.id === info.event.id);
                  if (ride) openRideModal(ride);
                }}
                eventContent={({ event }) => {
                  const status = formatRideStatus(event.extendedProps.status);
                  const color = STATUS_COLORS[event.extendedProps.status] || "bg-red-100 text-red-800";

                  return (
                    <div className={`w-full h-full p-2 rounded-md shadow-sm cursor-pointer ${color}`}>
                      <div className="font-semibold text-sm truncate">
                        <Car className="inline w-4 h-4 mr-1" />
                        {event.title}
                      </div>
                      <div className="text-[11px] uppercase tracking-wide mt-1">{status}</div>
                    </div>
                  );
                }}
                height="auto"
              />
            </div>
          )}
        </div>
      )}
    </RideLiveModalController>
  );
}
