import { useState, useEffect } from 'react';
import DriverTable from '../components/DriverTable';
import DriverFormModal from '../components/DriverFormModal';
import { fetchDrivers, createDriver, updateDriver, deleteDriver } from '../services/driverService';
import { Driver, DriverFormInput } from '../types';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchDrivers();
      setDrivers(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (driver: DriverFormInput) => {
    const isUpdate = !!editingDriver;

    if (isUpdate) {
      await updateDriver(editingDriver!.id, driver);
    } else {
      await createDriver(driver);
    }

    setModalOpen(false);
    setEditingDriver(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    await deleteDriver(id);
    await load();
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Drivers</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Driver
        </button>
      </div>

      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <DriverTable
          drivers={drivers}
          onEdit={(driver) => {
            setEditingDriver(driver);
            setModalOpen(true);
          }}
          onDelete={handleDelete}
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
