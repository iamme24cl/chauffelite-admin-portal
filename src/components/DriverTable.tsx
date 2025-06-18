import { Driver } from "../types";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

type Props = {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
  onToggleAvailability: (id: string, current: boolean) => void;
};

export default function DriverTable({
  drivers,
  onEdit,
  onDelete,
  onToggleAvailability,
}: Props) {
  return (
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-gray-100 text-xs uppercase text-gray-500">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2">Availability</th>
          <th className="px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {drivers.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-6 text-gray-400">
              No drivers found.
            </td>
          </tr>
        ) : (
          drivers.map((driver) => (
            <tr key={driver.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 font-medium">{driver.user?.name}</td>
              <td className="px-4 py-3">{driver.user?.email}</td>
              <td className="px-4 py-3">{driver.user?.phone}</td>
              <td className="px-4 py-3">
              <label className="relative inline-block w-11 h-6 cursor-pointer" title={driver.available ? 'Set Unavailable' : 'Set Available'}>
  <input
    type="checkbox"
    checked={driver.available}
    onChange={() => onToggleAvailability(driver.id, driver.available)}
    className="sr-only peer"
  />
  <div className="absolute inset-0 bg-gray-300 rounded-full transition peer-checked:bg-green-500" />
  <div className="absolute top-0.5 left-0.5 h-5 w-5 bg-white rounded-full shadow transition peer-checked:translate-x-5" />
</label>

              </td>
              <td className="px-4 py-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(driver)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <PencilIcon className="w-5 h-5 inline" />
                </button>
                <button
                  onClick={() => onDelete(driver.id)}
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
