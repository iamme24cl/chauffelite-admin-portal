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
    setRides(r);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.company_id]);

  const inProgressRides = rides.filter((r) => r.status === "IN_PROGRESS");

  return (
    <RideLiveModalController onStatusUpdate={load}>
      {(openRideModal) => (
        <div className="p-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard title="Drivers" value={drivers.length} icon={UserGroupIcon} />
            <SummaryCard title="Vehicles" value={vehicles.length} icon={CarIcon} />
            <SummaryCard title="Rides Today" value={rides.length} icon={CalendarDaysIcon} />
            <SummaryCard title="In Progress" value={inProgressRides.length} icon={ArrowPathIcon} />
          </div>

          {/* Today's Rides Table */}
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Today's Rides</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="bg-gray-100 text-sm text-gray-600">
                    <th className="px-4 py-2">Pickup</th>
                    <th className="px-4 py-2">Dropoff</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rides.map((ride) => (
                    <tr
                      key={ride.id}
                      className="border-t text-sm cursor-pointer hover:bg-gray-100"
                      onClick={() => openRideModal(ride)}
                    >
                      <td className="px-4 py-2">{ride.pickup.address}</td>
                      <td className="px-4 py-2">{ride.dropoff.address}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${
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
                      <td className="px-4 py-2">
                        {new Date(ride.created_at).toLocaleTimeString()}
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
        </div>
      )}
    </RideLiveModalController>
  );
}
