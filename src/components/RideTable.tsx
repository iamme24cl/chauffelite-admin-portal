import { Ride } from "../types";

const STATUS_COLORS: Record<string, string> = {
  REQUESTED: "bg-indigo-500",
  ACCEPTED: "bg-orange-500",
  IN_PROGRESS: "bg-blue-600",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-gray-500",
};

export default function RideTable({
  rides,
  onView,
}: {
  rides: Ride[];
  onView: (ride: Ride) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border rounded shadow-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-2">Pickup</th>
            <th className="px-4 py-2">Dropoff</th>
            <th className="px-4 py-2">Status</th>
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
                className="border-t hover:bg-gray-50 transition cursor-pointer"
                onClick={() => onView(ride)}
              >
                <td className="px-4 py-2 max-w-[200px] truncate" title={ride.pickup.address}>
                  {ride.pickup.address}
                </td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={ride.dropoff.address}>
                  {ride.dropoff.address}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium text-white ${
                      STATUS_COLORS[ride.status] || "bg-red-500"
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
