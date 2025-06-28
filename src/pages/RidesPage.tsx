import { useEffect, useState } from "react";
import { Ride } from "../types";
import { fetchRides } from "../services/rideService";
import RideTable from "../components/RideTable";
import RideLiveModalController from "../components/RideLiveModalController";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "bg-indigo-100 text-indigo-800",
  ACCEPTED: "bg-orange-100 text-orange-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"list" | "calendar">("list");
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);

  const loadRides = async () => {
    const res = await fetchRides();
    setRides(res);
  };

  useEffect(() => {
    loadRides();
    const media = window.matchMedia("(max-width: 640px)");
    setIsMobile(media.matches);
    const handler = () => setIsMobile(media.matches);
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const filteredRides = rides.filter((r) => {
    const matchStatus = statusFilter ? r.status === statusFilter : true;
    const startDate = dateRange?.start;
    const endDate = dateRange?.end;
    const rideStart = r.scheduled_start;

    const matchDate =
      startDate && endDate && rideStart
        ? new Date(rideStart) >= new Date(startDate) &&
          new Date(rideStart) <= new Date(endDate)
        : true;

    return matchStatus && matchDate;
  });

  const getEvents = () =>
    filteredRides.map((ride) => ({
      id: ride.id,
      title: ride.vehicle_class,
      start: ride.scheduled_start,
      end: ride.scheduled_end,
      extendedProps: {
        status: ride.status,
        vehicle_class: ride.vehicle_class,
      },
    }));

  const exportPDF = () => {
      const doc = new jsPDF();
      doc.text("Ride Reservations", 14, 15);
      autoTable(doc, {
        startY: 20,
        head: [["Pickup Address", "Dropoff Address", "Status", "Start Time", "End Time", "Fare"]],
        body: filteredRides.map((r) => [
          r.pickup?.address || "-",
          r.dropoff?.address || "-",
          r.status,
          r.scheduled_start ? new Date(r.scheduled_start).toLocaleString() : "N/A",
          r.scheduled_end ? new Date(r.scheduled_end).toLocaleString() : "N/A",
          r.fare ? `$${r.fare.toFixed(2)} ${r.fare || ""}` : "N/A",
        ]),
      });
      doc.save("reservations.pdf");
    };

  return (
    <RideLiveModalController onStatusUpdate={loadRides}>
      {(openRideModal) => (
        <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
            <div className="flex gap-2">
              {"list calendar".split(" ").map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as "list" | "calendar")}
                  className={`px-4 py-1 rounded-md text-sm font-medium border ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab === "list" ? "List View" : "Calendar View"}
                </button>
              ))}
              <button
                onClick={exportPDF}
                className="px-4 py-1 rounded-md text-sm font-medium border bg-green-600 text-white hover:bg-green-700"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {" REQUESTED ACCEPTED IN_PROGRESS COMPLETED".split(" ").map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 text-sm rounded border whitespace-nowrap ${
                  statusFilter === status
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status || "All"}
              </button>
            ))}
          </div>

          {/* List View */}
          {activeTab === "list" && (
            <>
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <input
                  type="date"
                  className="border px-2 py-1 rounded w-full sm:w-auto"
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value } as any)}
                />
                <input
                  type="date"
                  className="border px-2 py-1 rounded w-full sm:w-auto"
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value } as any)}
                />
              </div>

              <div className="bg-white rounded p-4 shadow overflow-x-auto">
                <RideTable rides={filteredRides} onView={openRideModal} />
              </div>
            </>
          )}

          {/* Calendar View */}
          {activeTab === "calendar" && (
            <div className="bg-white rounded p-4 shadow">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView={isMobile ? "listWeek" : "dayGridMonth"}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                }}
                events={getEvents()}
                eventClick={(info) => {
                  const clickedRide = rides.find((r) => r.id === info.event.id);
                  if (clickedRide) openRideModal(clickedRide);
                }}
                eventContent={({ event }) => {
                  const status = event.extendedProps.status;
                  const color = STATUS_COLORS[status] || "bg-red-100 text-red-800";

                  return (
                    <div
                      className={`w-full h-full p-2 rounded-md shadow-md cursor-pointer transition transform hover:scale-[1.02] ${color}`}
                      style={{ minWidth: "100%" }}
                    >
                      <div className="font-semibold text-sm truncate">{event.title}</div>
                      <div className="text-[11px] uppercase tracking-wide mt-1">{status}</div>
                    </div>
                  );
                }}
                height="auto"
                aspectRatio={1.4}
              />
            </div>
          )}
        </div>
      )}
    </RideLiveModalController>
  );
}
