import { useState, useEffect, useCallback } from "react";
import { fetchDrivers } from "../services/driverService";
import { fetchVehicles } from "../services/vehicleService";
import { fetchRides } from "../services/rideService";
import { useAuth } from "../context/AuthContext";
import { Ride, Driver, Vehicle } from "../types";
import {
  UserGroupIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { Car as CarIcon } from "lucide-react";
import SummaryCard from "../components/SummaryCard";
import RideLiveModalController from "../components/RideLiveModalController";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Updated color map with REQUESTED and darker shades for better visibility
const COLORS = {
  REQUESTED: "#6366F1",     // Indigo 500
  ACCEPTED: "#F97316",      // Orange 500
  IN_PROGRESS: "#2563EB",   // Blue 600
  COMPLETED: "#10B981",     // Green 500
  CANCELLED: "#6B7280",     // Gray 500
} as const;

type RideStatus = keyof typeof COLORS;

export default function Dashboard() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.company_id) return;
    setLoading(true);
    try {
      const [d, v, r] = await Promise.all([fetchDrivers(), fetchVehicles(), fetchRides()]);
      setDrivers(d);
      setVehicles(v);

      // 🔁 Use LOCAL day bounds so "today" matches the admin's/browser's timezone.
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date();
      endOfToday.setHours(23, 59, 59, 999);

      const startMs = startOfToday.getTime();
      const endMs = endOfToday.getTime();

      const todayRides = r
        .filter((ride: Ride) => {
          if (!ride.scheduled_start) return false;
          const t = new Date(ride.scheduled_start).getTime(); // ISO Z → epoch (local compare)
          return t >= startMs && t <= endMs;
        })
        .sort(
          (a: Ride, b: Ride) =>
            new Date(a.scheduled_start || 0).getTime() -
            new Date(b.scheduled_start || 0).getTime()
        );

      setRides(todayRides);
    } finally {
      setLoading(false);
    }
  }, [user?.company_id]);

  useEffect(() => {
    load();
  }, [load]);

  const inProgressRides = rides.filter((r) => r.status === "IN_PROGRESS");

  const allStatuses: RideStatus[] = [
    "REQUESTED",
    "ACCEPTED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
  ];

  const statusBreakdown = Object.entries(
    rides.reduce(
      (acc: Record<RideStatus, number>, ride) => {
        const status = (ride.status as RideStatus) || "REQUESTED";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      Object.fromEntries(allStatuses.map((s) => [s, 0])) as Record<RideStatus, number>
    )
  ).map(([status, count]) => ({ status: status as RideStatus, count }));

  // Keep the chart as created-at trend; optional: switch to scheduled_start if you prefer.
  const timeTrendData = rides
    .map((r) => new Date(r.created_at).getHours())
    .reduce((acc: Record<string, number>, hour) => {
      const label = `${hour}:00`;
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

  const trendChartData = Object.entries(timeTrendData).map(([hour, count]) => ({
    hour,
    count,
  }));

  return (
    <RideLiveModalController onStatusUpdate={load}>
      {(openRideModal) => (
        <main className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 pb-16 font-sans">
          <div className="max-w-screen-xl mx-auto w-full space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard title="Drivers" value={drivers.length} icon={UserGroupIcon} />
              <SummaryCard title="Vehicles" value={vehicles.length} icon={CarIcon} />
              <SummaryCard title="Rides Today" value={rides.length} icon={CalendarDaysIcon} />
              <SummaryCard title="In Progress" value={inProgressRides.length} icon={ArrowPathIcon} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Ride Status Breakdown</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="count"
                      nameKey="status"
                      outerRadius={90}
                      label
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.status] || "#E5E7EB"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap gap-4 text-sm">
                  {allStatuses.map((status) => (
                    <div key={status} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[status] }}
                      ></span>
                      <span className="text-gray-700">{status.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-semibold mb-4">Rides Created by Hour</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Today's Rides Table */}
            <div className="bg-white rounded shadow p-4 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">Today's Rides</h2>
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading rides...</div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="px-4 py-2 text-left">Pickup</th>
                      <th className="px-4 py-2 text-left">Dropoff</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      {/* 🔁 show Scheduled instead of Created */}
                      <th className="px-4 py-2 text-left">Scheduled</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rides.map((ride) => {
                      const scheduled = ride.scheduled_start ? new Date(ride.scheduled_start) : null;
                      return (
                        <tr
                          key={ride.id}
                          className="border-t hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                          onClick={() => openRideModal(ride)}
                        >
                          <td className="px-4 py-2 truncate max-w-[220px]" title={ride.pickup?.address || ""}>
                            {ride.pickup?.address?.trim() || "—"}
                          </td>
                          <td className="px-4 py-2 truncate max-w-[220px]" title={ride.dropoff?.address || ""}>
                            {ride.dropoff?.address?.trim() || "—"}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                                ride.status === "REQUESTED"
                                  ? "bg-indigo-500"
                                  : ride.status === "ACCEPTED"
                                  ? "bg-orange-500"
                                  : ride.status === "IN_PROGRESS"
                                  ? "bg-blue-600"
                                  : ride.status === "COMPLETED"
                                  ? "bg-green-500"
                                  : ride.status === "CANCELLED"
                                  ? "bg-gray-500"
                                  : "bg-gray-400"
                              }`}
                            >
                              {ride.status}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {scheduled
                              ? scheduled.toLocaleString(undefined, {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                    {rides.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center text-gray-500 py-4">
                          No rides today.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      )}
    </RideLiveModalController>
  );
}
