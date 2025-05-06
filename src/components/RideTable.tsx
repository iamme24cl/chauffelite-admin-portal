import { Ride } from "../types"

export default function RideTable({
  rides,
  onView,
}: {
  rides: Ride[];
  onView: (ride: Ride) => void;
}) {
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
            <td colSpan={5} className="text-center p-4 text-gray-500">
              No rides found.
            </td>
          </tr>
        ) : (
          rides.map((ride) => (
            <tr key={ride.id}>
              <td className="border px-4 py-2">{ride.rider_id.slice(0, 8)}</td>
              <td className="border px-4 py-2">{ride.pickup.address}</td>
              <td className="border px-4 py-2">{ride.dropoff.address}</td>
              <td className="border px-4 py-2">{ride.status}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => onView(ride)}
                >
                  View
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
