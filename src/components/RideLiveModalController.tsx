import { useState } from "react";
import RideLiveModal from "./RideLiveModal";
import { Ride } from "../types";

export default function RideLiveModalController({
  children,
  onStatusUpdate,
}: {
  children: (openModal: (ride: Ride) => void) => React.ReactNode;
  onStatusUpdate?: () => void;
}) {
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  const handleStatusUpdate = async () => {
    if (onStatusUpdate) {
      setTimeout(onStatusUpdate, 300);
    }
  }

  return (
    <>
      {children((ride: Ride) => setSelectedRide(ride))}
      {selectedRide && (
        <RideLiveModal
          ride={selectedRide}
          onClose={() => setSelectedRide(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
}
