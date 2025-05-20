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
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Vehicles</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingVehicle(undefined);
            setModalOpen(true);
          }}
        >
          + Add Vehicle
        </button>
      </div>
      <VehicleTable 
        vehicles={vehicles}
        onEdit={(vehicle) => {
          setEditingVehicle({
            id: vehicle.id,
            plate: vehicle.plate,
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            vehicle_class: vehicle.vehicle_class
          });
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
