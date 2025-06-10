import { Ride } from "../types";

export default function RideTable({
  rides,
  onView,
}: {
  rides: Ride[];
  onView: (ride: Ride) => void;
}) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-2 border">Rider</th>
            <th className="px-4 py-2 border">Pickup</th>
            <th className="px-4 py-2 border">Dropoff</th>
            <th className="px-4 py-2 border">Status</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {rides.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No rides found.
              </td>
            </tr>
          ) : (
            rides.map((ride) => (
              <tr
                key={ride.id}
                className="border-t hover:bg-gray-50 cursor-pointer transition"
                onClick={() => onView(ride)}
              >
                <td className="px-4 py-2">{ride.rider_id.slice(0, 8)}</td>
                <td
                  className="px-4 py-2 max-w-[200px] truncate"
                  title={ride.pickup.address}
                >
                  {ride.pickup.address}
                </td>
                <td
                  className="px-4 py-2 max-w-[200px] truncate"
                  title={ride.dropoff.address}
                >
                  {ride.dropoff.address}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ride.status === "IN_PROGRESS"
                        ? "bg-blue-500 text-white"
                        : ride.status === "COMPLETED"
                        ? "bg-green-500 text-white"
                        : ride.status === "ACCEPTED"
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-400 text-white"
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
