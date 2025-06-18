import { useEffect, useState } from "react";
import VehicleTable from "../components/VehicleTable";
import VehicleFormModal from "../components/VehicleFormModal";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
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
    }
  }

  useEffect(() => {
    load();
  }, [])

  const handleSave = async (vehicle: VehicleFormInput) => {
    if (vehicle.id) {
      await updateVehicle(vehicle.id, vehicle);
    } else {
      await createVehicle(vehicle);
    }
    await load();
  }

  const handleDelete = async (id: string) => {
    await deleteVehicle(id);
    await load();
  }

  return (
    <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Vehicles</h2>
        <button
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setEditingVehicle(undefined);
            setModalOpen(true);
          }}
        >
          Add Vehicle
        </button>
      </div>
      <VehicleTable 
        vehicles={vehicles}
        onEdit={(vehicle) => {
          setEditingVehicle(vehicle);
          setModalOpen(true)
        }}
        onDelete={handleDelete}
      />
      <VehicleFormModal 
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initial={editingVehicle}
      />
    </div>
  )
}
