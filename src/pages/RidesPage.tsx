import { useEffect, useState } from "react";
import { Ride } from "../types";
import { assignDriverToRide, fetchRides } from "../services/rideService";
import RideTable from "../components/RideTable";
import RideLiveModalController from "../components/RideLiveModalController"; // ✅ use controller

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);

  const loadRides = async () => {
    const res = await fetchRides();
    setRides(res);
  };

  useEffect(() => {
    loadRides();
  }, []);

  return (
    <RideLiveModalController onStatusUpdate={loadRides}>
      {(openRideModal) => (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Rides</h2>
          <RideTable
            rides={rides}
            onView={openRideModal} // ✅ open modal from table click
          />
        </div>
      )}
    </RideLiveModalController>
  );
}
