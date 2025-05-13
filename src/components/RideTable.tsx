import { useState, useEffect } from "react";
import { Ride, Driver } from "../types";
import { fetchDrivers } from "../services/driverService";

export default function RideTable({
  rides,
  onView,
  onAssign,
}: {
  rides: Ride[];
  onView: (ride: Ride) => void;
  onAssign: (rideId: string, driverId: string) => void;
}) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<{ [rideId: string]: string }>({});

  useEffect(() => {
    const loadDrivers = async () => {
      const data = await fetchDrivers();
      setDrivers(data);
    };
    loadDrivers();
  }, []);

  useEffect(() => {
    const prefillSelectedDrivers: { [rideId: string]: string } = {};
    rides.forEach((ride) => {
      if (ride.driver_id) {
        prefillSelectedDrivers[ride.id] = ride.driver_id;
      }
    });
    setSelectedDriver(prefillSelectedDrivers);
  }, [rides]);

  return (
    <table className="w-full border text-left">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 border">Rider</th>
          <th className="px-4 py-2 border">Pickup</th>
          <th className="px-4 py-2 border">Dropoff</th>
          <th className="px-4 py-2 border">Status</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rides.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center p-4 text-gray-500">No rides found.</td>
          </tr>
        ) : (
          rides.map((ride) => (
            <tr key={ride.id}>
              <td className="border px-4 py-2">{ride.rider_id.slice(0, 8)}</td>
              <td className="border px-4 py-2">{ride.pickup.address}</td>
              <td className="border px-4 py-2">{ride.dropoff.address}</td>
              <td className="border px-4 py-2">{ride.status}</td>
              <td className="border px-4 py-2 flex items-center gap-4">
                <button className="text-blue-600 hover:underline mr-2" onClick={() => onView(ride)}>View</button>
                {(ride.status !== "CANCELLED" && ride.status !== "COMPLETED") && (
                  <div className="flex items-center gap-2">
                    <select
                      className="border rounded px-1 py-1"
                      value={selectedDriver[ride.id] || ""}
                      onChange={(e) =>
                        setSelectedDriver((prev) => ({ ...prev, [ride.id]: e.target.value }))
                      }
                    >
                      <option value="" disabled>
                        {selectedDriver[ride.id]
                          ? drivers.find((d) => d.id === selectedDriver[ride.id])?.user.name || "Loading..."
                          : "Select Driver"}
                      </option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.user.name || driver.id.slice(0, 6)}
                        </option>
                      ))}
                    </select>
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      disabled={!selectedDriver[ride.id]}
                      onClick={() => {
                        if (selectedDriver[ride.id]) {
                          onAssign(ride.id, selectedDriver[ride.id]);
                        }
                      }}
                    >
                      Assign
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
