import { Driver } from "../types";
import {  PencilIcon, TrashIcon } from '@heroicons/react/24/solid';

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
    <table className="min-w-full bg-white shadow rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Name</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Phone</th>
          <th className="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        {drivers.map((driver) => (
          <tr key={driver.id} className="border-t">
            <td className="px-4 py-2">{driver.user?.name}</td>
            <td className="px-4 py-2">{driver.user?.email}</td>
            <td className="px-4 py-2">{driver.user?.phone}</td>
            <td className="px-4 py-2 space-x-2">
              <button onClick={() => onEdit(driver)} className="text-blue-600 hover:text-blue-800">
                <PencilIcon className="w-5 h-5 inline" />
              </button>
              <button onClick={() => onDelete(driver.id)} className="text-red-600 hover:text-red-800">
                <TrashIcon className="w-5 h-5 inline" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}