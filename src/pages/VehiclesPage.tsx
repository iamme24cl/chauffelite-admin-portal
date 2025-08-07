import { useEffect, useState } from "react";
import VehicleTable from "../components/VehicleTable";
import VehicleFormModal from "../components/VehicleFormModal";
import {
  fetchVehicles,
  createVehicle,
  updateVehicle,
  toggleVehicleAvailability,
} from "../services/vehicleService";
import { Vehicle, VehicleFormInput } from "../types";
import { Plus, CarFront } from "lucide-react"; // ✅ added CarFront icon

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

  // ✅ Convert Vehicle -> VehicleFormInput
  const transformVehicleToFormInput = (vehicle: Vehicle): VehicleFormInput => ({
    id: vehicle.id,
    plate: vehicle.plate,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    vehicle_class: vehicle.vehicle_class.id,
    pricing: vehicle.pricing,
  });

  return (
    <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-2 text-blue-700">
          <CarFront className="w-6 h-6" />
          <h1 className="text-2xl font-bold text-gray-800">Vehicles</h1>
        </div>

        {/* Circular + Button */}
        <button
          onClick={() => {
            setEditingVehicle(null);
            setModalOpen(true);
          }}
          className="
            flex items-center justify-center
            w-12 h-12
            bg-gradient-to-br from-blue-500 to-indigo-600
            text-white rounded-full shadow-lg
            hover:from-blue-600 hover:to-indigo-700
            active:scale-95
            transition duration-200
          "
          aria-label="Add Vehicle"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="bg-white rounded shadow-lg p-6 overflow-x-auto">
        <VehicleTable
          vehicles={vehicles}
          onEdit={(vehicle) => {
            setEditingVehicle(vehicle);
            setModalOpen(true);
          }}
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
        initial={
          editingVehicle
            ? transformVehicleToFormInput(editingVehicle)
            : undefined
        }
      />
    </div>
  );
}
