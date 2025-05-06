import { useEffect, useState } from 'react';
import { Ride } from '../types';
import { fetchRides } from '../services/rideService';
import RideTable from '../components/RideTable';
import RideLiveModal from '../components/RideLiveModal';

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetchRides();
      setRides(res);
    };
    load();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Rides</h2>
      <RideTable rides={rides} onView={setSelectedRide} />
      {selectedRide && (
        <RideLiveModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
        />
      )}
    </div>
  )
}
