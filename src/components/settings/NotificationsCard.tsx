export default function NotificationsCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
        <p className="text-sm text-gray-500 mt-1">Control alerts for bookings, changes, and updates</p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
        Alerts
      </button>
    </div>
  );
}
