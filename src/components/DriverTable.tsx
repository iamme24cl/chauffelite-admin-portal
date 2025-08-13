import { Driver } from "../types";
import { User, Mail, Phone, CheckCircle } from "lucide-react";

type Props = {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onToggleAvailability: (id: string, current: boolean) => void;
  togglingId?: string | null;
};

function getInitials(name?: string) {
  return name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "?";
}

export default function DriverTable({
  drivers,
  onEdit,
  onToggleAvailability,
  togglingId,
}: Props) {
  return (
    <table className="min-w-full text-sm text-left text-gray-700">
      <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
        <tr>
          <th className="px-4 py-2 font-medium">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Name
            </div>
          </th>
          <th className="px-4 py-2 font-medium">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email
            </div>
          </th>
          <th className="px-4 py-2 font-medium">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Phone
            </div>
          </th>
          <th className="px-4 py-2 font-medium text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Available
            </div>
          </th>
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
                className="border-t hover:bg-blue-50 transition-all duration-300 ease-in-out animate-fadeIn cursor-pointer"
                onClick={() => onEdit(driver)}
              >
                <td className="px-4 py-3 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm shadow-inner">
                    {getInitials(driver.user?.name)}
                  </div>
                  <span className="font-medium">{driver.user?.name}</span>
                </td>
                <td className="px-4 py-3">{driver.user?.email}</td>
                <td className="px-4 py-3">{driver.user?.phone}</td>
                <td
                  className="px-4 py-3 text-center"
                  onClick={(e) => e.stopPropagation()}
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
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
