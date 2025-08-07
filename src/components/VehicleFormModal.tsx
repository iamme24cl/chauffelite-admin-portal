import { useState, useEffect } from "react";
import { VehicleFormInput } from "../types";
import {
  CarFront,
  BadgeDollarSign,
  Settings,
  XCircle,
  Save,
  Landmark,
  Badge,
  Calendar,
  LayoutGrid,
} from "lucide-react";

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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 animate-fadeIn space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <CarFront className="w-6 h-6 text-blue-600" />
            {initial ? "Update Vehicle" : "Add New Vehicle"}
          </h2>
        </div>

        {/* Form */}
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
          className="space-y-6"
        >
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Plate */}
            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Badge className="w-4 h-4 text-blue-500" />
                License Plate
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Make */}
            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Landmark className="w-4 h-4 text-blue-500" />
                Make
              </label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Model */}
            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <CarFront className="w-4 h-4 text-blue-500" />
                Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                Year
              </label>
              <input
                type="number"
                min={1900}
                max={2100}
                value={year}
                onChange={(e) => setYear(e.target.value ? parseInt(e.target.value) : "")}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Class */}
            <div className="col-span-full">
              <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                <LayoutGrid className="w-4 h-4 text-blue-500" />
                Vehicle Class
              </label>
              <select
                value={vehicleClass}
                onChange={(e) => setVehicleClass(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Class</option>
                {vehicleClassOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mt-4">
              <BadgeDollarSign className="w-5 h-5 text-green-600" />
              Pricing Details
            </h3>
            <p className="text-sm text-gray-500 mb-4">Customize fare details for each trip type.</p>

            {tripTypes.map((type) => (
              <div key={type} className="bg-gray-50 border p-4 rounded-md mb-4 space-y-3">
                <h4 className="text-md font-medium text-gray-700 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  {type.replace("_", " ")} Pricing
                </h4>

                {type === "HOURLY" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
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
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <input
                      type="number"
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
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
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
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
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
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
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
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
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
                      className="p-2 border rounded"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow"
            >
              <Save className="w-4 h-4" />
              {initial ? "Update Vehicle" : "Create Vehicle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
