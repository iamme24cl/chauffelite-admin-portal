import { useState, useEffect } from 'react';
import DriverTable from '../components/DriverTable';
import DriverFormModal from '../components/DriverFormModal';
import {
  fetchDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
  toggleDriverAvailability,
} from '../services/driverService';
import { Driver, DriverFormInput } from '../types';

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
    <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Drivers</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          Add Driver
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
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
