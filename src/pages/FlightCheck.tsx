import { useState } from "react";
import { getFlightInfo } from "../services/flightService";

export default function FlightCheckPage() {
  const [flight, setFlight] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFlight = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getFlightInfo(flight, date);
      if (Array.isArray(data) && data.length > 0) {
        setResult(data[0]);
      } else {
        setError("No flight data found for this date.");
      }
    } catch (err) {
      setError("Flight not found or API failed.");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (iso: string | undefined) => {
    if (!iso) return "N/A";
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Flight Lookup</h1>
          <p className="text-sm text-gray-500">Check flight status and details by number and date</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Flight Number (e.g. DL1066)"
            value={flight}
            onChange={(e) => setFlight(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
        </div>
        <button
          onClick={fetchFlight}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          disabled={loading || !flight || !date}
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {result && (
        <div className="bg-white shadow rounded-lg p-6 space-y-2 text-sm">
          <p><strong>Flight:</strong> {result.number || "N/A"}</p>
          <p><strong>Status:</strong> {result.status || "Unknown"}</p>
          <p>
            <strong>Departure:</strong>{" "}
            {result.departure?.airport?.name || "N/A"} at{" "}
            {formatDateTime(result.departure?.scheduledTime?.local)}
          </p>
          <p>
            <strong>Arrival:</strong>{" "}
            {result.arrival?.airport?.name || "N/A"} at{" "}
            {formatDateTime(result.arrival?.scheduledTime?.local)}
          </p>
        </div>
      )}
    </div>
  );
}
