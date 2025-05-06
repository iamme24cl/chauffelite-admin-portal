import { Ride } from '../types';
import { useRideSession } from "../hooks/useRideSession";

export default function RideLiveModal({
  ride,
  onClose,
}: {
  ride: Ride;
  onClose: () => void;
}) {
  const session = useRideSession(ride.id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-[400px]">
        <h2 className="text-xl font-bold mb-4">Live Ride Status</h2>

        <p><strong>Status:</strong>{session?.status || ride.status}</p>
        <p><strong>Pickup:</strong>{ride.pickup.address}</p>
        <p><strong>Dropoff:</strong>{ride.dropoff.address}</p>
        <p><strong>Driver Location:</strong>{" "}
        {session?.driver_location
          ? `${session.driver_location.lat}, ${session.driver_location.lng}`
          : "Not available"}
        </p>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

