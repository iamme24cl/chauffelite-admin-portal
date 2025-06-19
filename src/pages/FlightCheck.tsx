import { useState } from "react";
import axios from "axios";

export default function FlightCheckPage() {
  const [flight, setFlight] = useState("");
  const [date, setDate] = useState("");
  const [result, setResult] = useState<any>(null);

  const fetchFlight = async () => {
    try {
      const res = await axios.get("/api/flight", {
        params: { flight, date }
      });
      setResult(res.data);
    } catch (err) {
      alert("Failed to fetch flight data.");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Flight Lookup</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Flight Number (e.g. UA100)"
          value={flight}
          onChange={(e) => setFlight(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        />
        <button
          onClick={fetchFlight}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {result && (
        <div className="bg-white p-4 rounded shadow mt-6 space-y-2 text-sm">
          <p><strong>Flight:</strong> {result.flight?.iata}</p>
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Departure:</strong> {result.departure?.airport} at {result.departure?.scheduled}</p>
          <p><strong>Arrival:</strong> {result.arrival?.airport} at {result.arrival?.scheduled}</p>
        </div>
      )}
    </div>
  );
}
