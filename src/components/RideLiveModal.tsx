import { useEffect, useState } from "react";
import { Ride, Driver } from "../types";
import { updateRideStatus, assignDriverToRide } from "../services/rideService";
import { fetchDrivers } from "../services/driverService";
import { useRideSession } from "../hooks/useRideSession";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon paths for Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const greenIcon = new Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const redIcon = new Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

function FitMapToBounds({ points }: { points: LatLngExpression[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [points, map]);
  return null;
}

export default function RideLiveModal({
  ride,
  onClose,
  onStatusUpdate,
}: {
  ride: Ride;
  onClose: () => void;
  onStatusUpdate: () => void;
}) {
  const session = useRideSession(ride.id);
  const driverLocation: LatLngExpression | null = session?.driver_location
    ? [session.driver_location.lat, session.driver_location.lng]
    : null;

  const pickupLocation: LatLngExpression = [ride.pickup.lat, ride.pickup.lng];
  const dropoffLocation: LatLngExpression = [ride.dropoff.lat, ride.dropoff.lng];
  const fitPoints: LatLngExpression[] = [pickupLocation, dropoffLocation, ...(driverLocation ? [driverLocation] : [])];

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>(ride.driver_id || "");
  const [assignedDriverId, setAssignedDriverId] = useState<string>(ride.driver_id || "");

  useEffect(() => {
    const loadDrivers = async () => {
      const data = await fetchDrivers();
      setDrivers(data);
    };
    loadDrivers();
  }, []);

  useEffect(() => {
    setAssignedDriverId(ride.driver_id || "");
  }, [ride.driver_id]);

  const handleAssignDriver = async () => {
    if (selectedDriverId) {
      try {
        await assignDriverToRide(ride.id, selectedDriverId);
        setAssignedDriverId(selectedDriverId);
        onStatusUpdate();
      } catch (err) {
        console.error("Failed to assign driver", err);
      }
    }
  };

  const currentDriver = drivers.find((d) => d.id === assignedDriverId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Live Ride Status</h2>

        <p><strong>Status:</strong> {session?.status || ride.status}</p>
        <p><strong>Pickup:</strong> {ride.pickup.address}</p>
        <p><strong>Dropoff:</strong> {ride.dropoff.address}</p>
        <p><strong>Current Driver:</strong> {currentDriver ? currentDriver.user.name : "Unassigned"}</p>

        <div className="my-4">
          <MapContainer
            center={pickupLocation}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={pickupLocation} icon={greenIcon}>
              <Popup>Pickup</Popup>
            </Marker>

            <Marker position={dropoffLocation} icon={redIcon}>
              <Popup>Dropoff</Popup>
            </Marker>

            {driverLocation && (
              <Marker position={driverLocation}>
                <Popup>Driver is here</Popup>
              </Marker>
            )}

            <FitMapToBounds points={fitPoints} />
          </MapContainer>
        </div>

        <div className="mt-4 space-y-2">
          <p className="font-semibold">Set Status:</p>
          {["REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"]
            .filter((s) => s !== ride.status)
            .map((status) => (
              <button
                key={status}
                onClick={async () => {
                  try {
                    await updateRideStatus(ride.id, status);
                  } catch (err) {
                    console.error("Failed to update ride status", err);
                  }
                  onClose();
                  onStatusUpdate();
                }}
                className="px-3 py-1 mr-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Set {status}
              </button>
            ))}
        </div>

        <div className="mt-4">
          <p className="font-semibold">Assign Driver:</p>
          <div className="flex items-center space-x-2 mt-2">
            <select
              className="border px-2 py-1 rounded text-sm"
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
            >
              <option value="">Select driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.user.name || driver.id.slice(0, 6)}
                </option>
              ))}
            </select>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
              disabled={!selectedDriverId}
              onClick={handleAssignDriver}
            >
              Assign
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
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
}
