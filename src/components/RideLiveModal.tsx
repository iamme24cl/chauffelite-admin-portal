import { useEffect, useState } from "react";
import { Ride, Driver, Vehicle } from "../types";
import { updateRideStatus, assignDriverToRide, assignVehicleToRide } from "../services/rideService";
import { fetchDrivers } from "../services/driverService";
import { fetchVehicles } from "../services/vehicleService";
import { useRideSessionSocket } from "../hooks/useRideSessionSocket";
import { formatVehicleClass, formatRideStatus } from "../utils/formatters";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { LatLngExpression, Icon } from "leaflet";
import {
  BadgeCheck,
  Car,
  MapPin,
  DollarSign,
  User,
  Calendar,
  X,
} from "lucide-react";
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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <BadgeCheck className="w-6 h-6 text-blue-600" />
            Live Ride Overview
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Ride Details */}
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
          <div className="space-y-2">
            <p className="flex items-center gap-2"><BadgeCheck className="w-4 h-4" /> <strong>Status:</strong> {formatRideStatus(session?.status || ride.status)}</p>
            <p className="flex items-center gap-2"><Car className="w-4 h-4" /> <strong>Class:</strong> {formatVehicleClass(ride.vehicle_class)}</p>
            <p className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> <strong>Fare:</strong> {ride.fare ? `$${ride.fare.toFixed(2)}` : "—"}</p>
            <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <strong>Scheduled:</strong> {ride.scheduled_start ? `${new Date(ride.scheduled_start).toLocaleString()} → ${ride.scheduled_end ? new Date(ride.scheduled_end).toLocaleString() : "—"}` : "—"}</p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> <strong>Pickup:</strong> {ride.pickup.address}</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-400" /> <strong>Dropoff:</strong> {ride.dropoff.address}</p>
            <p className="flex items-center gap-2"><User className="w-4 h-4" /> <strong>Driver:</strong> {currentDriver?.user?.name || "Unassigned"}</p>
            <p className="flex items-center gap-2"><Car className="w-4 h-4" /> <strong>Vehicle:</strong> {currentVehicle ? `${currentVehicle.make} ${currentVehicle.model} (${currentVehicle.plate})` : "Unassigned"}</p>
          </div>
        </div>

        {/* Map */}
        <div className="mb-8">
          <MapContainer center={pickupLocation} zoom={13} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }} className="rounded-lg overflow-hidden shadow border">
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={pickupLocation} icon={greenIcon}><Popup>Pickup</Popup></Marker>
            <Marker position={dropoffLocation} icon={redIcon}><Popup>Dropoff</Popup></Marker>
            {driverLocation && <Marker position={driverLocation}><Popup>Driver Location</Popup></Marker>}
            <FitMapToBounds points={fitPoints} />
          </MapContainer>
        </div>

        {/* Assignments */}
        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-sm font-medium mb-2">Assign Driver</p>
            <div className="flex gap-2">
              <select className="w-full border px-3 py-2 rounded text-sm" value={selectedDriverId} onChange={(e) => setSelectedDriverId(e.target.value)}>
                <option value="">Select driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>{driver.user.name || driver.id.slice(0, 6)}</option>
                ))}
              </select>
              <button onClick={handleAssignDriver} disabled={!selectedDriverId || isCompleted} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm disabled:opacity-50">Assign</button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Assign Vehicle</p>
            <div className="flex gap-2">
              <select className="w-full border px-3 py-2 rounded text-sm" value={selectedVehicleId} onChange={(e) => setSelectedVehicleId(e.target.value)}>
                <option value="">Select vehicle</option>
                {vehicles.filter((v) => v.vehicle_class.key === ride.vehicle_class).map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>{vehicle.make} {vehicle.model} ({vehicle.plate})</option>
                ))}
              </select>
              <button onClick={handleAssignVehicle} disabled={!selectedVehicleId || isCompleted} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm disabled:opacity-50">Assign</button>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-2">Set Ride Status</p>
          <div className="flex flex-wrap gap-2">
            {["REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"]
              .filter((s) => s !== ride.status)
              .map((status) => (
                <button key={status} onClick={async () => {
                  await updateRideStatus(ride.id, status);
                  onStatusUpdate();
                  onClose();
                }} className={`px-4 py-2 rounded text-white text-sm shadow hover:opacity-90 ${statusColors[status]}`}>Set {status}</button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
