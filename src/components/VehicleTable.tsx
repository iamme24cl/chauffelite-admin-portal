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
    <table className="w-full text-left border rounded shadow-sm">
      <thead className="bg-gray-50 text-gray-700 text-sm uppercase">
        <tr>
          <th className="px-4 py-2 border">License Plate</th>
          <th className="px-4 py-2 border">Make</th>
          <th className="px-4 py-2 border">Model</th>
          <th className="px-4 py-2 border">Year</th>
          <th className="px-4 py-2 border">Class</th>
          <th className="px-4 py-2 border">Availability</th>
          <th className="px-4 py-2 border text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center p-4 text-gray-500">
              No vehicles found.
            </td>
          </tr>
        ) : (
          vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2 border">{vehicle.plate}</td>
              <td className="px-4 py-2 border">{vehicle.make}</td>
              <td className="px-4 py-2 border">{vehicle.model}</td>
              <td className="px-4 py-2 border">{vehicle.year}</td>
              <td className="px-4 py-2 border">{vehicle.vehicle_class}</td>
              <td className="px-4 py-2 border">
                <label className="relative inline-block w-11 h-6 cursor-pointer" title={vehicle.available ? 'Set Unavailable' : 'Set Available'}>
                  <input
                    type="checkbox"
                    checked={vehicle.available}
                    onChange={() => onToggleAvailability(vehicle.id, vehicle.available)}
                    className="sr-only peer"
                  />
                  <div className="absolute inset-0 bg-gray-300 rounded-full transition peer-checked:bg-green-500" />
                  <div className="absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition peer-checked:translate-x-5" />
                </label>
              </td>
              <td className="px-4 py-2 border text-center space-x-2">
                <button
                  onClick={() => onEdit(vehicle)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <PencilIcon className="w-5 h-5 inline" />
                </button>
                <button
                  onClick={() => onDelete(vehicle.id)}
                  className="text-red-600 hover:text-red-800"
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
