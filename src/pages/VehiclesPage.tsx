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
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const load = async () => {
    try {
      const res = await fetchVehicles();
      setVehicles(res);
    } catch (err) {
      console.error("Failed to load vehicles", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (vehicle: VehicleFormInput) => {
    const isUpdate = !!editingVehicle;

    if (isUpdate && editingVehicle?.id) {
      await updateVehicle(editingVehicle.id, vehicle);
    } else {
      await createVehicle(vehicle);
    }

    setModalOpen(false);
    setEditingVehicle(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteVehicle(id);
    await load();
  };

  const handleToggleAvailability = async (vehicleId: string, current: boolean) => {
    try {
      await toggleVehicleAvailability(vehicleId, current);
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === vehicleId ? { ...v, available: !current } : v
        )
      );
    } catch (err) {
      console.error("Failed to toggle availability", err);
    }
  };


  return (
    <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Vehicles</h1>
        <button
          onClick={() => {
            setEditingVehicle(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
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
          onToggleAvailability={handleToggleAvailability}
        />
      </div>

      <VehicleFormModal
        visible={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingVehicle(null);
        }}
        onSubmit={handleSave}
        initial={editingVehicle || undefined}
      />
    </div>
  );
}
