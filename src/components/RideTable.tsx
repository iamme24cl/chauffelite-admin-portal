import { Ride } from "../types";

export default function RideTable({
  rides,
  onView,
  onAssign,
}: {
  rides: Ride[];
  onView: (ride: Ride) => void;
   onAssign: (rideId: string, driverId: string) => Promise<void>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border rounded shadow-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase tracking-wide text-xs">
          <tr>
            <th className="px-4 py-2 border">Rider</th>
            <th className="px-4 py-2 border">Pickup</th>
            <th className="px-4 py-2 border">Dropoff</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {rides.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                No rides found.
              </td>
            </tr>
          ) : (
            rides.map((ride) => (
              <tr
                key={ride.id}
                className="border-t hover:bg-gray-50 transition cursor-pointer"
                onClick={() => onView(ride)}
              >
                <td className="px-4 py-2">{ride.rider_id.slice(0, 8)}</td>
                <td className="px-4 py-2">{ride.pickup.address}</td>
                <td className="px-4 py-2">{ride.dropoff.address}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                      ride.status === "IN_PROGRESS"
                        ? "bg-blue-500"
                        : ride.status === "COMPLETED"
                        ? "bg-green-500"
                        : ride.status === "ACCEPTED"
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-400"
                    }`}
                  >
                    {ride.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
