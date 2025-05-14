import { useState, useEffect } from "react";
import { VehicleFormInput } from "../types";

export default function VehicleFormModal({
  visible,
  onClose,
  onSubmit,
  initial,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (vehicle: VehicleFormInput) => void;
  initial?: VehicleFormInput;
}) {
  const [plate, setPlate] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [vehicleClass, setVehicleClass] = useState("");

  useEffect(() => {
    setPlate(initial?.plate || "");
    setMake(initial?.make || "");
    setModel(initial?.model || "");
    setYear(initial?.year || "");
    setVehicleClass(initial?.vehicle_class || "");
  }, [initial]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">{initial ? "Edit Vehicle" : "Add Vehicle"}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!year || isNaN(Number(year))) return;
            onSubmit({
              id: initial?.id,
              plate,
              make,
              model,
              year: Number(year),
              vehicle_class: vehicleClass,
            });
            onClose();
          }}
        >
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="License Plate"
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Make"
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : "")}
            placeholder="Year"
            className="w-full mb-4 p-2 border rounded"
            required
            min={1900}
            max={2100}
          />
          <select
            value={vehicleClass}
            onChange={(e) => setVehicleClass(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          >
            <option value="">Select Vehicle Class</option>
            <option value="Executive Sedan">Executive Sedan</option>
            <option value="Luxury Sedan">Luxury Sedan</option>
            <option value="SUV">SUV</option>
            <option value="Stretch Limo">Stretch Limo</option>
            <option value="Sprinter Van">Sprinter Van</option>
            <option value="Mini Coach">Mini Coach</option>
            <option value="Luxury Electric">Luxury Electric</option>
            <option value="Party Bus">Party Bus</option>
            <option value="Vintage Classic">Vintage Classic</option>
            <option value="Wheelchair Accessible Van">Wheelchair Accessible Van</option>
          </select>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1 bg-gray-200 rounded">
              Cancel
            </button>
            <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">
              {initial ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
