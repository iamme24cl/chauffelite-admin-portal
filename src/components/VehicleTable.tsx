import { Vehicle } from "../types";

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
          <th className="px-4 py-2 text-left">License Plate</th>
          <th className="px-4 py-2 text-left">Make</th>
          <th className="px-4 py-2 text-left">Model</th>
          <th className="px-4 py-2 text-left">Year</th>
          <th className="px-4 py-2 text-left">Class</th>
          <th className="px-4 py-2 text-center">Availability</th>
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
              <tr key={vehicle.id} className="border-t hover:bg-gray-50 transition">
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onEdit(vehicle)}
                >
                  {vehicle.plate}
                </td>
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onEdit(vehicle)}
                >
                  {vehicle.make}
                </td>
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onEdit(vehicle)}
                >
                  {vehicle.model}
                </td>
                <td
                  className="px-4 py-3 cursor-pointer"
                  onClick={() => onEdit(vehicle)}
                >
                  {vehicle.year}
                </td>
                <td
                  className="px-4 py-3 capitalize cursor-pointer"
                  onClick={() => onEdit(vehicle)}
                >
                  {vehicle.vehicle_class.replace("_", " ")}
                </td>
                <td
                  className="px-4 py-3 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="inline-flex items-center justify-center">
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
                      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition duration-300" />
                      <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5" />
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
