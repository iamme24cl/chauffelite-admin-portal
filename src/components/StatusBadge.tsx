type RideStatus = "REQUESTED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

const STATUS_COLORS: Record<RideStatus, string> = {
  REQUESTED: "bg-indigo-500",
  ACCEPTED: "bg-orange-500",
  IN_PROGRESS: "bg-blue-600",
  COMPLETED: "bg-green-500",
  CANCELLED: "bg-gray-500",
};

export default function StatusBadge({ status }: { status: RideStatus }) {
  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${STATUS_COLORS[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}
