import { useState, useEffect } from "react";
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

export default function Dashboard() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [rides, setRides] = useState<Ride[]>([]);

  const load = async () => {
    if (!user?.company_id) return;

    const [d, v, r] = await Promise.all([
      fetchDrivers(),
      fetchVehicles(),
      fetchRides(),
    ]);

    setDrivers(d);
    setVehicles(v);

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    const todayRides = r.filter((ride: Ride) => {
      if (!ride.scheduled_start) return false;
      const rideDate = new Date(ride.scheduled_start);
      return rideDate >= today && rideDate < tomorrow;
    });

    setRides(todayRides);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.company_id]);

  const inProgressRides = rides.filter((r) => r.status === "IN_PROGRESS");

  return (
    <RideLiveModalController onStatusUpdate={load}>
      {(openRideModal) => (
        <main className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 pb-16">
          <div className="max-w-screen-xl mx-auto w-full">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-3 sm:p-4 text-sm sm:text-base bg-white rounded shadow">
                <SummaryCard title="Drivers" value={drivers.length} icon={UserGroupIcon} />
              </div>
              <div className="p-3 sm:p-4 text-sm sm:text-base bg-white rounded shadow">
                <SummaryCard title="Vehicles" value={vehicles.length} icon={CarIcon} />
              </div>
              <div className="p-3 sm:p-4 text-sm sm:text-base bg-white rounded shadow">
                <SummaryCard title="Rides Today" value={rides.length} icon={CalendarDaysIcon} />
              </div>
              <div className="p-3 sm:p-4 text-sm sm:text-base bg-white rounded shadow">
                <SummaryCard title="In Progress" value={inProgressRides.length} icon={ArrowPathIcon} />
              </div>
            </div>

            {/* Today's Rides Table */}
            <div className="bg-white rounded shadow p-4 overflow-x-auto">
              <h2 className="text-lg font-semibold mb-4">Today's Rides</h2>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-4 py-2 text-left">Pickup</th>
                    <th className="px-4 py-2 text-left">Dropoff</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map((ride) => (
                    <tr
                      key={ride.id}
                      className="border-t hover:bg-gray-50 active:bg-gray-100 cursor-pointer"
                      onClick={() => openRideModal(ride)}
                    >
                      <td className="px-4 py-2 whitespace-nowrap truncate max-w-[120px]" title={ride.pickup.address}>
                        {ride.pickup.address}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap truncate max-w-[120px]" title={ride.dropoff.address}>
                        {ride.dropoff.address}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                          ride.status === "IN_PROGRESS"
                            ? "bg-blue-500"
                            : ride.status === "COMPLETED"
                            ? "bg-green-500"
                            : ride.status === "ACCEPTED"
                            ? "bg-yellow-500 text-black"
                            : "bg-gray-400"
                        }`}>
                          {ride.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {new Date(ride.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                    </tr>
                  ))}
                  {rides.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center text-gray-500 py-4">
                        No rides today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
    </RideLiveModalController>
  );
}
