import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Vehicle } from "../types";

type Props = {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, current: boolean) => void;
};

export default function VehicleTable({
  vehicles,
  onEdit,
  onDelete,
  onToggleAvailability,
}: Props) {
  return (
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-4 py-2 text-left">License Plate</th>
            <th className="px-4 py-2 text-left">Make</th>
            <th className="px-4 py-2 text-left">Model</th>
            <th className="px-4 py-2 text-left">Year</th>
            <th className="px-4 py-2 text-left">Class</th>
            <th className="px-4 py-2 text-left">Availability</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-400">
                No vehicles found.
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3">{vehicle.plate}</td>
                <td className="px-4 py-3">{vehicle.make}</td>
                <td className="px-4 py-3">{vehicle.model}</td>
                <td className="px-4 py-3">{vehicle.year}</td>
                <td className="px-4 py-3 capitalize">{vehicle.vehicle_class.replace("_", " ")}</td>
                <td className="px-4 py-3">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <span className={`text-xs font-medium ${vehicle.available ? "text-green-600" : "text-gray-400"}`}>
                      {vehicle.available ? "Available" : "Unavailable"}
                    </span>
                    <input
                      type="checkbox"
                      checked={vehicle.available}
                      onChange={() => onToggleAvailability(vehicle.id, vehicle.available)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 relative transition">
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition peer-checked:translate-x-5" />
                    </div>
                  </label>
                </td>
                <td className="px-4 py-3 text-center space-x-2">
                  <button
                    onClick={() => onEdit(vehicle)}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Edit"
                  >
                    <PencilIcon className="w-5 h-5 inline" />
                  </button>
                  <button
                    onClick={() => onDelete(vehicle.id)}
                    className="text-red-600 hover:text-red-800 transition"
                    title="Delete"
                  >
                    <TrashIcon className="w-5 h-5 inline" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
  );
}
