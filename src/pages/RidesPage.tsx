import { useEffect, useState } from 'react';
import { Ride } from '../types';
import { assignDriverToRide, fetchRides } from '../services/rideService';
import RideTable from '../components/RideTable';
import RideLiveModal from '../components/RideLiveModal';

export default function RidesPage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const loadRides = async () => {
    const res = await fetchRides();
    setRides(res);
  }
  
  useEffect(() => {
    loadRides();
  }, []);

  const handleAssign = async (rideId: string, driverId: string) => {
    try {
      await assignDriverToRide(rideId, driverId);
      await loadRides();
    } catch (err) {
      alert("Failed to assign driver");
    }
  }

  const handleStatusUpdate = async () => {
    setSelectedRide(null);
    setTimeout(loadRides, 300);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Rides</h2>
      <RideTable rides={rides} onView={setSelectedRide} onAssign={handleAssign} />
      {selectedRide && (
        <RideLiveModal 
          ride={selectedRide} 
          onClose={() => setSelectedRide(null)} 
          onStatusUpdate={handleStatusUpdate} 
        />
      )}
    </div>
  )
}


