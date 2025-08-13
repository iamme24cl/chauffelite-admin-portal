import { Vehicle } from "../types";
import {
  CarFront,
  BadgeCheck,
  BadgeDollarSign,
  Calendar,
  ParkingSquare,
  BadgePlus,
} from "lucide-react";

type Props = {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onToggleAvailability: (id: string, current: boolean) => void;
  togglingId?: string | null;
};

export default function VehicleTable({
  vehicles,
  onEdit,
  onToggleAvailability,
  togglingId,
}: Props) {
  return (
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-gray-100 text-xs uppercase text-gray-500">
        <tr>
          <th className="px-4 py-2">
            <div className="flex items-center gap-1">
              <BadgePlus className="w-4 h-4" />
              Plate
            </div>
          </th>
          <th className="px-4 py-2">
            <div className="flex items-center gap-1">
              <CarFront className="w-4 h-4" />
              Make
            </div>
          </th>
          <th className="px-4 py-2">
            <div className="flex items-center gap-1">
              <BadgeCheck className="w-4 h-4" />
              Model
            </div>
          </th>
          <th className="px-4 py-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Year
            </div>
          </th>
          <th className="px-4 py-2">
            <div className="flex items-center gap-1">
              <ParkingSquare className="w-4 h-4" />
              Class
            </div>
          </th>
          <th className="px-4 py-2 text-center">
            <div className="flex items-center justify-center gap-1">
              <BadgeDollarSign className="w-4 h-4" />
              Availability
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {vehicles.length === 0 ? (
          <tr>
            <td colSpan={6} className="text-center py-6 text-gray-400">
              No vehicles found.
            </td>
          </tr>
        ) : (
          vehicles.map((vehicle) => {
            const isLoading = togglingId === vehicle.id;

            return (
              <tr
                key={vehicle.id}
                className="border-t hover:bg-blue-50 transition-all animate-fadeIn cursor-pointer"
                onClick={() => onEdit(vehicle)}
              >
                <td className="px-4 py-3">{vehicle.plate}</td>
                <td className="px-4 py-3">{vehicle.make}</td>
                <td className="px-4 py-3">{vehicle.model}</td>
                <td className="px-4 py-3">{vehicle.year}</td>
                <td className="px-4 py-3 capitalize">
                  {vehicle.vehicle_class.title.replace("_", " ")}
                </td>
                <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <label className="relative inline-block w-11 h-6 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={vehicle.available}
                      disabled={isLoading}
                      onChange={() =>
                        onToggleAvailability(vehicle.id, vehicle.available)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition" />
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all peer-checked:translate-x-5" />
                  </label>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
