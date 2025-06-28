import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="px-4 py-2 text-left">Pickup</th>
          <th className="px-4 py-2 text-left">Dropoff</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Created</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="border-t">
            <td className="px-4 py-2"><Skeleton width={120} /></td>
            <td className="px-4 py-2"><Skeleton width={120} /></td>
            <td className="px-4 py-2"><Skeleton width={80} /></td>
            <td className="px-4 py-2"><Skeleton width={100} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
