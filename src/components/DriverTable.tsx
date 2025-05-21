import { Driver } from "../types";
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

export default function DriverTable({
  drivers,
  onEdit,
  onDelete,
}: {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <table className="min-w-full bg-white shadow rounded text-sm">
      <thead className="bg-gray-50 text-gray-700 uppercase">
        <tr>
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Phone</th>
          <th className="px-4 py-2 text-left">Availability</th>
          <th className="px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {drivers.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center py-4 text-gray-500">
              No drivers found.
            </td>
          </tr>
        ) : (
          drivers.map((driver) => (
            <tr key={driver.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{driver.user?.name}</td>
              <td className="px-4 py-2">{driver.user?.email}</td>
              <td className="px-4 py-2">{driver.user?.phone}</td>
              <td className="px-4 py-2">
                {driver.available ? (
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                    Available
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
                    Unavailable
                  </span>
                )}
              </td>
              <td className="px-4 py-2 text-center space-x-2">
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
