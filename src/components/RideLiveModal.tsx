import { useEffect, useState } from "react";
import { Ride, Driver, Vehicle } from "../types";
import { updateRideStatus, assignDriverToRide, assignVehicleToRide } from "../services/rideService";
import { fetchDrivers } from "../services/driverService";
import { fetchVehicles } from "../services/vehicleService";
import { useRideSessionSocket } from "../hooks/useRideSessionSocket";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const token = localStorage.getItem("access_token") || "";
  const session = useRideSessionSocket(ride.id, token);

  const driverLocation: LatLngExpression | null = session?.driver_location
    ? [session.driver_location.lat, session.driver_location.lng]
    : null;

  const pickupLocation: LatLngExpression = [ride.pickup.lat, ride.pickup.lng];
  const dropoffLocation: LatLngExpression = [ride.dropoff.lat, ride.dropoff.lng];
  const fitPoints: LatLngExpression[] = [pickupLocation, dropoffLocation, ...(driverLocation ? [driverLocation] : [])];

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>(ride.driver_id || "");
  const [assignedDriverId, setAssignedDriverId] = useState<string>(ride.driver_id || "");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(ride.vehicle_id || "");
  const [assignedVehicleId, setAssignedVehicleId] = useState<string>(ride.vehicle_id || "");

  const isCompleted = (session?.status || ride.status) === "COMPLETED";

  useEffect(() => {
    const load = async () => {
      const [driverData, vehicleData] = await Promise.all([
        fetchDrivers(),
        fetchVehicles(),
      ]);
      setDrivers(driverData);
      setVehicles(vehicleData);
    };
    load();
  }, []);

  useEffect(() => {
    setAssignedDriverId(ride.driver_id || "");
  }, [ride.driver_id]);


  const handleAssignDriver = async () => {
    if (!selectedDriverId) return;
    try {
      await assignDriverToRide(ride.id, selectedDriverId);
      setAssignedDriverId(selectedDriverId);
      onStatusUpdate();
    } catch (err) {
      alert(`Failed to assign driver: ${err}`);
    }
  };

  const handleAssignVehicle = async () => {
    if (!selectedVehicleId) return;
    try {
      await assignVehicleToRide(ride.id, selectedVehicleId);
      setAssignedVehicleId(selectedVehicleId);
      onStatusUpdate();
    } catch (err) {
      alert(`Failed to assign vehicle: ${err}`);
    }
  };

  const currentDriver = drivers.find((d) => d.id === assignedDriverId);
  const currentVehicle = vehicles.find((v) => v.id === assignedVehicleId);

  const statusColors: Record<string, string> = {
    REQUESTED: "bg-gray-500",
    ACCEPTED: "bg-yellow-400 text-black",
    IN_PROGRESS: "bg-blue-500",
    COMPLETED: "bg-green-500",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Live Ride Overview</h2>

        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-800 mb-4">
          
          <p><strong>Status:</strong> {session?.status || ride.status}</p>
          <p><strong>Trip Type:</strong> {ride.trip_type ?? "—"}</p>
          <p><strong>Fare:</strong> {ride.fare ? `$${ride.fare.toFixed(2)}` : "—"}</p>
          <p>
            <strong>Scheduled:</strong>{" "}
            {ride.scheduled_start
              ? `${new Date(ride.scheduled_start).toLocaleString()} → ${
                  ride.scheduled_end ? new Date(ride.scheduled_end).toLocaleString() : "—"
                }`
              : "—"}
          </p>
          <p><strong>Pickup:</strong> {ride.pickup.address}</p>
          <p><strong>Dropoff:</strong> {ride.dropoff.address}</p>
          <p><strong>Vehicle Class:</strong> {ride.vehicle_class}</p>
          <p><strong>Driver:</strong> {currentDriver?.user?.name || "Unassigned"}</p>
          <p><strong>Vehicle:</strong> {currentVehicle ? `${currentVehicle.make} ${currentVehicle.model} (${currentVehicle.plate})` : "Unassigned"}</p>
        </div>

        <div className="mb-6">
          <MapContainer center={pickupLocation} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={pickupLocation} icon={greenIcon}><Popup>Pickup</Popup></Marker>
            <Marker position={dropoffLocation} icon={redIcon}><Popup>Dropoff</Popup></Marker>
            {driverLocation && <Marker position={driverLocation}><Popup>Driver Location</Popup></Marker>}
            <FitMapToBounds points={fitPoints} />
          </MapContainer>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold mb-1">Assign Driver:</p>
            <div className="flex items-center space-x-2">
              <select
                className="border px-2 py-1 rounded text-sm w-full"
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
                onClick={handleAssignDriver}
                disabled={!selectedDriverId || isCompleted}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>

          <div>
            <p className="font-semibold mb-1">Assign Vehicle:</p>
            <div className="flex items-center space-x-2">
              <select
                className="border px-2 py-1 rounded text-sm w-full"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
              >
                <option value="">Select vehicle</option>
                {vehicles
                  .filter((v) => v.vehicle_class === ride.vehicle_class)
                  .map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.plate})
                    </option>
                  ))}
              </select>
              <button
                onClick={handleAssignVehicle}
                disabled={!selectedVehicleId || isCompleted}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50"
              >
                Assign
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-semibold mb-2">Set Status:</p>
          <div className="flex flex-wrap gap-2">
            {["REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"]
              .filter((s) => s !== ride.status)
              .map((status) => (
                <button
                  key={status}
                  onClick={async () => {
                    try {
                      await updateRideStatus(ride.id, status);
                      onStatusUpdate();
                      onClose();
                    } catch (err) {
                      console.error("Failed to update ride status", err);
                    }
                  }}
                  className={`px-3 py-1 text-white rounded text-sm hover:opacity-90 ${statusColors[status]}`}
                >
                  Set {status}
                </button>
              ))}
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
