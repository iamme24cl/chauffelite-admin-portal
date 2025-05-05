import { useState, useEffect } from 'react';
import DriverTable from '../components/DriverTable';
import DriverFormModal from '../components/DriverFormModal';
import { fetchDrivers, createDriver, updateDriver, deleteDriver } from '../services/driverService';
import { Driver, DriverFormInput } from '../types';

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const load = async () => {
    const res = await fetchDrivers();
    setDrivers(res);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (driver: DriverFormInput) => {
    const { user } = driver;
  
    const isUpdate = !!editingDriver;
  
    if (isUpdate) {
      await updateDriver(editingDriver!.id, {
        user: {
          name: user.name,
          phone: user.phone,
          email: user.email,
        },
      });
    } else {
      const { email, password, name, phone } = user;
      if (!email || !password) {
        alert("Email and password are required to create driver user.");
        return;
      }
  
      try {
        await createDriver({
          user: { name, phone, email, password },
        });
      } catch (error) {
        console.error("Error creating driver:", error);
        alert(`Driver creation failed. See console for details.`);
        return;
      }
    }
    await load();
    setEditingDriver(null);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this driver? This action is irreversible.");
    if (!confirm) return;

    await deleteDriver(id);
    await load();
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Drivers</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setEditingDriver(null);
            setModalOpen(true);
          }}
        >
          + Add Driver
        </button>
      </div>

      <DriverTable
        drivers={drivers}
        onEdit={(driver) => {
          setEditingDriver(driver);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <DriverFormModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        initial={editingDriver ? { user: editingDriver.user } : undefined}
      />
    </div>
  );
}
