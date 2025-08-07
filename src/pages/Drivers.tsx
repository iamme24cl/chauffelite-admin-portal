import { useState, useEffect } from "react";
import DriverTable from "../components/DriverTable";
import DriverFormModal from "../components/DriverFormModal";
import {
  fetchDrivers,
  createDriver,
  updateDriver,
  toggleDriverAvailability,
} from "../services/driverService";
import { Driver, DriverFormInput } from "../types";
import { Users, Plus } from "lucide-react";
// import Lottie from "lottie-react";
// import drivingAnimation from "../assets/driving.json"; // optional animation

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetchDrivers();
      setDrivers(res);
    } catch (err) {
      console.error("Failed to load drivers", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (driver: DriverFormInput) => {
    if (editingDriver) {
      await updateDriver(editingDriver.id, driver);
    } else {
      await createDriver(driver);
    }

    setModalOpen(false);
    setEditingDriver(null);
    await load();
  };

  const handleToggleAvailability = async (driverId: string, current: boolean) => {
    try {
      setTogglingId(driverId);
      await toggleDriverAvailability(driverId, current);
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === driverId ? { ...d, available: !current } : d
        )
      );
    } catch (err) {
      console.error("Failed to toggle driver availability", err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-blue-600">
          <Users className="w-6 h-6" />
          <h1 className="text-2xl font-bold text-gray-800">Drivers</h1>
        </div>

        <button
          onClick={() => {
            setEditingDriver(null);
            setModalOpen(true)
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
          aria-label="Add Driver"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Optional animation */}
      {/* <Lottie animationData={drivingAnimation} className="w-full max-w-xl mx-auto" loop /> */}

      <div className="bg-white rounded shadow-lg p-6 overflow-x-auto animate-fadeIn">
        <DriverTable
          drivers={drivers}
          onEdit={(driver) => {
            setEditingDriver(driver);
            setModalOpen(true);
          }}
          onToggleAvailability={handleToggleAvailability}
          togglingId={togglingId}
        />
      </div>

      <DriverFormModal
        visible={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingDriver(null);
        }}
        onSubmit={handleSave}
        initial={editingDriver || undefined}
      />
    </div>
  );
}
