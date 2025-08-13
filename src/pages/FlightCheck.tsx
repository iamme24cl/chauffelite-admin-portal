import { useState } from "react";
import { getFlightInfo } from "../services/flightService";
import Lottie from "lottie-react";
import planeAnimation from "../assets/lottie/plane-flying.json";
import Skeleton from "react-loading-skeleton";
import AntPath from "../components/AntPath";
import "react-loading-skeleton/dist/skeleton.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { MdFlightTakeoff, MdFlightLand } from "react-icons/md";

// Fix leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
        const matched = data.find((f: any) => f.number?.replace(/\s/g, "")?.toLowerCase() === flight.replace(/\s/g, "").toLowerCase());
        setResult(matched || data[0]);
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "en-route":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "landed":
        return "bg-blue-100 text-blue-700";
      case "expected":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const departureCoords = [
    result?.departure?.airport?.location?.lat,
    result?.departure?.airport?.location?.lon,
  ];
  const arrivalCoords = [
    result?.arrival?.airport?.location?.lat,
    result?.arrival?.airport?.location?.lon,
  ];

  const hasMap =
    typeof departureCoords[0] === "number" &&
    typeof departureCoords[1] === "number" &&
    typeof arrivalCoords[0] === "number" &&
    typeof arrivalCoords[1] === "number";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8 font-sans">
      <div className="flex flex-col items-center text-center space-y-4">
        <Lottie animationData={planeAnimation} loop className="w-28 h-28" />
        <h1 className="text-3xl font-bold text-gray-800">Flight Lookup</h1>
        <p className="text-sm text-gray-500">Check live flight status and route</p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Flight Number (e.g. DL1066)"
            value={flight}
            onChange={(e) => setFlight(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>
        <button
          onClick={fetchFlight}
          disabled={loading || !flight || !date}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow transition w-full sm:w-auto"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </div>

      {loading && (
        <div className="bg-white rounded-xl shadow p-6 space-y-2">
          <Skeleton height={20} count={5} />
        </div>
      )}

      {result && (
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2">
            {result.airline?.iata ? (
              <img
                src={`https://content.airhex.com/content/logos/airlines_${result.airline.iata}_50_50_s.png`}
                alt={result.airline.name}
                className="h-6 w-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-logo.png";
                }}
              />
            ) : (
              <img src="/fallback-logo.png" alt="Airline" className="h-6 w-auto" />
            )}
            <div className="font-semibold text-lg text-gray-800">
              {result.airline?.name || "Airline"} Flight {result.number || "N/A"}
            </div>
          </div>

          <div>
            <span
              title={
                result.status === "Unknown"
                  ? "This usually means the airline hasn't updated the real-time status yet."
                  : `Status: ${result.status}`
              }
              className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(result.status)}`}
            >
              {result.status === "Unknown"
                ? "Unknown (not yet updated)"
                : result.status || "N/A"}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="font-medium flex items-center gap-1 text-gray-600">
                <MdFlightTakeoff /> Departure
              </div>
              <p className="text-gray-800">{result.departure?.airport?.name || "N/A"}</p>
              <p className="text-gray-500">{formatDateTime(result.departure?.scheduledTime?.local)}</p>
              <p className="text-xs text-gray-500">
                Terminal {result.departure?.terminal || "?"}, Gate {result.departure?.gate || "?"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="font-medium flex items-center gap-1 text-gray-600">
                <MdFlightLand /> Arrival
              </div>
              <p className="text-gray-800">{result.arrival?.airport?.name || "N/A"}</p>
              <p className="text-gray-500">{formatDateTime(result.arrival?.scheduledTime?.local)}</p>
              <p className="text-xs text-gray-500">
                Terminal {result.arrival?.terminal || "?"}, Gate {result.arrival?.gate || "?"}
              </p>
            </div>
          </div>

          {hasMap ? (
            <div className="mt-4">
              <h3 className="text-sm text-gray-600 mb-2 font-semibold">Route Map</h3>
              <MapContainer
                center={departureCoords as [number, number]}
                zoom={4}
                className="h-60 w-full rounded-md"
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                />
                <Marker position={departureCoords as [number, number]}>
                  <Popup>Departure: {result.departure?.airport?.name}</Popup>
                </Marker>
                <Marker position={arrivalCoords as [number, number]}>
                  <Popup>Arrival: {result.arrival?.airport?.name}</Popup>
                </Marker>
                <AntPath positions={[departureCoords, arrivalCoords] as [number, number][]} />
              </MapContainer>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-4">
              🌍 Route map is not available. Coordinates missing for one or both airports.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
