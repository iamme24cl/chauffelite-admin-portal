import { useState, useEffect } from "react";
import { VehicleFormInput } from "../types";

type TripType = "ONE_WAY" | "ROUND_TRIP" | "HOURLY";

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
  const [pricing, setPricing] = useState<VehicleFormInput["pricing"]>({});

  useEffect(() => {
    if (visible && initial) {
      setPlate(initial.plate || "");
      setMake(initial.make || "");
      setModel(initial.model || "");
      setYear(initial.year || "");
      setVehicleClass(initial.vehicle_class || "");
      setPricing(initial.pricing || {});
    } else if (!visible) {
      setPlate("");
      setMake("");
      setModel("");
      setYear("");
      setVehicleClass("");
      setPricing({});
    }
  }, [initial, visible]);

  if (!visible) return null;

  const vehicleClassOptions = [
    { key: "sedan", label: "Sedan" },
    { key: "first_class", label: "First Class" },
    { key: "suv", label: "SUV" },
    { key: "sprinter", label: "Sprinter" },
    { key: "limo", label: "Limo" },
  ];

  const tripTypes: TripType[] = ["ONE_WAY", "ROUND_TRIP", "HOURLY"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{initial ? "Update Vehicle" : "Add Vehicle"}</h2>
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
              pricing,
            });
            onClose();
          }}
          className="space-y-4"
        >
          <input
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            placeholder="License Plate"
            className="w-full p-2 border rounded"
            required
          />
          <input
            value={make}
            onChange={(e) => setMake(e.target.value)}
            placeholder="Make"
            className="w-full p-2 border rounded"
            required
          />
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Model"
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : "")}
            placeholder="Year"
            className="w-full p-2 border rounded"
            required
            min={1900}
            max={2100}
          />
          <select
            value={vehicleClass}
            onChange={(e) => setVehicleClass(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Vehicle Class</option>
            {vehicleClassOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-semibold">Pricing</h3>

            {tripTypes.map((type) => (
              <div key={type} className="border p-3 rounded bg-gray-50 space-y-2">
                <h4 className="font-medium">{type.replace("_", " ")} Pricing</h4>

                {type === "HOURLY" ? (
                  <>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Hourly Rate"
                      value={pricing?.HOURLY?.hourly_rate ?? ""}
                      onChange={(e) =>
                        setPricing((prev) => ({
                          ...prev,
                          HOURLY: {
                            ...prev?.HOURLY,
                            hourly_rate: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Minimum Hours"
                      value={pricing?.HOURLY?.min_hours ?? ""}
                      onChange={(e) =>
                        setPricing((prev) => ({
                          ...prev,
                          HOURLY: {
                            ...prev?.HOURLY,
                            min_hours: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Base Fare"
                      value={pricing?.[type]?.base_fare ?? ""}
                      onChange={(e) =>
                        setPricing((prev) => ({
                          ...prev,
                          [type]: {
                            ...prev?.[type],
                            base_fare: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Per Mile"
                      value={pricing?.[type]?.per_mile ?? ""}
                      onChange={(e) =>
                        setPricing((prev) => ({
                          ...prev,
                          [type]: {
                            ...prev?.[type],
                            per_mile: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Per Minute"
                      value={pricing?.[type]?.per_minute ?? ""}
                      onChange={(e) =>
                        setPricing((prev) => ({
                          ...prev,
                          [type]: {
                            ...prev?.[type],
                            per_minute: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Night Surcharge"
                      value={pricing?.[type]?.night_surcharge ?? ""}
                      onChange={(e) =>
                        setPricing((prev) => ({
                          ...prev,
                          [type]: {
                            ...prev?.[type],
                            night_surcharge: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                    <input
                      type="number"
                      step="0.01"
                      placeholder="City Modifier (%)"
                      value={pricing?.[type]?.city_modifier ?? ""}
                      onChange={(e) =>
                        setPricing((prev) => ({
                          ...prev,
                          [type]: {
                            ...prev?.[type],
                            city_modifier: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      className="w-full p-2 border rounded"
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
