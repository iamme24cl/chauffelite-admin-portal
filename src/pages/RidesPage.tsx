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

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(false);

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

  const filteredRides = statusFilter
    ? rides.filter((r) => r.status === statusFilter)
    : rides;

  const getEvents = () =>
    filteredRides.map((ride) => ({
      id: ride.id,
      title: `${ride.vehicle_class} • ${ride.status}`,
      start: ride.scheduled_start,
      end: ride.scheduled_end,
      backgroundColor:
        ride.status === "COMPLETED"
          ? "#22c55e"
          : ride.status === "IN_PROGRESS"
          ? "#3b82f6"
          : ride.status === "ACCEPTED"
          ? "#facc15"
          : ride.status === "REQUESTED"
          ? "#6b7280"
          : "#ef4444",
      borderColor: "#000",
    }));

  return (
    <RideLiveModalController onStatusUpdate={loadRides}>
      {(openRideModal) => (
        <div className="space-y-6 py-6 px-4 sm:px-6 lg:px-8">
          {/* Header + Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-2xl font-semibold">Reservations</h2>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {["", "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"].map(
                (status) => (
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
                )
              )}
            </div>
          </div>

          {/* Ride Table */}
          <div className="bg-white rounded p-4 shadow overflow-x-auto">
            <RideTable rides={filteredRides} onView={openRideModal} />
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded p-4 shadow">
            <h3 className="text-lg font-semibold mb-4">Calendar View</h3>
            <div className="overflow-x-auto">
              <div className="w-full text-xs sm:text-sm">
                <FullCalendar
                  plugins={[
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    listPlugin,
                  ]}
                  initialView={isMobile ? "listWeek" : "dayGridMonth"}
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                  }}
                  events={getEvents()}
                  eventClick={(info) => {
                    const clickedRide = rides.find(
                      (r) => r.id === info.event.id
                    );
                    if (clickedRide) openRideModal(clickedRide);
                  }}
                  height="auto"
                  aspectRatio={1.4}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </RideLiveModalController>
  );
}
