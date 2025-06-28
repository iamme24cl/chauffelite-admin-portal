import { Driver } from "../types";

type Props = {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onToggleAvailability: (id: string, current: boolean) => void;
  togglingId?: string | null;
};

export default function DriverTable({
  drivers,
  onEdit,
  onToggleAvailability,
  togglingId,
}: Props) {
  return (
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-gray-100 text-xs uppercase text-gray-500">
        <tr>
          <th className="px-4 py-2">Name</th>
          <th className="px-4 py-2">Email</th>
          <th className="px-4 py-2">Phone</th>
          <th className="px-4 py-2 text-center">Availability</th>
        </tr>
      </thead>
      <tbody>
        {drivers.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-6 text-gray-400">
              No drivers found.
            </td>
          </tr>
        ) : (
          drivers.map((driver) => {
            const isLoading = togglingId === driver.id;

            return (
              <tr
                key={driver.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td
                  className="px-4 py-3 font-medium cursor-pointer"
                  onClick={() => onEdit(driver)}
                >
                  {driver.user?.name}
                </td>
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onEdit(driver)}
                >
                  {driver.user?.email}
                </td>
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onEdit(driver)}
                >
                  {driver.user?.phone}
                </td>
                <td className="px-4 py-3 text-center">
                  <div
                    className="inline-flex items-center justify-center"
                    onClick={(e) => e.stopPropagation()} // prevent row edit
                  >
                    <label className="relative inline-block w-11 h-6 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={driver.available}
                        disabled={isLoading}
                        onChange={() =>
                          onToggleAvailability(driver.id, driver.available)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition duration-300" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 peer-checked:translate-x-5" />
                    </label>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
