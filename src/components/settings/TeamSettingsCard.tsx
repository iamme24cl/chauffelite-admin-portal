export default function TeamSettingsCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
        <p className="text-sm text-gray-500 mt-1">Manage admin, dispatcher, and read-only users</p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
        Manage Team
      </button>
    </div>
  );
}
