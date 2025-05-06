import {  PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Vehicle } from "../types";

export default function VehicleTable({
  vehicles,
  onEdit,
  onDelete,
}: {
  vehicles: Vehicle[];
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <table className="w-full text-left border">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 border">License Plate</th>
          <th className="px-4 py-2 border">Make</th>
          <th className="px-4 py-2 border">Model</th>
          <th className="px-4 py-2 border">Year</th>
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center p-4 text-gray-500">
              No vehicles found.
            </td>
          </tr>
        ) : (
          vehicles.map((vehicle) => (
            <tr key={vehicle.id} className="border-t">
              <td className="px-4 py-2 border">{vehicle.plate}</td>
              <td className="px-4 py-2 border">{vehicle.make}</td>
              <td className="px-4 py-2 border">{vehicle.model}</td>
              <td className="px-4 py-2 border">{vehicle.year}</td>
              <td className="px-4 py-2 border space-x-2">
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
  )
}
