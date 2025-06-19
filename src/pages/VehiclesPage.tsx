import { useEffect, useState } from "react";
import VehicleTable from "../components/VehicleTable";
import VehicleFormModal from "../components/VehicleFormModal";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  toggleVehicleAvailability,
} from "../services/vehicleService";
import { Vehicle, VehicleFormInput } from "../types";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<VehicleFormInput | undefined>(undefined);

  const load = async () => {
    try {
      const res = await fetchVehicles();
      setVehicles(res);
    } finally {
      // optional: add error logging
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (vehicle: VehicleFormInput) => {
    if (vehicle.id) {
      await updateVehicle(vehicle.id, vehicle);
    } else {
      await createVehicle(vehicle);
    }
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteVehicle(id);
    await load();
  };

  return (
    <div className="px-4 sm:px-8 py-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Vehicles</h2>
          <p className="text-sm text-gray-500">Manage your fleet and availability</p>
        </div>
        <button
          className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 transition shadow"
          onClick={() => {
            setEditingVehicle(undefined);
            setModalOpen(true);
          }}
        >
          + Add Vehicle
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <VehicleTable
          vehicles={vehicles}
          onEdit={(vehicle) => {
            setEditingVehicle(vehicle);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
          onToggleAvailability={async (vehicleId, current) => {
            await toggleVehicleAvailability(vehicleId, current);
            await load();
          }}
        />
      </div>

      <VehicleFormModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initial={editingVehicle}
      />
    </div>
  );
}
