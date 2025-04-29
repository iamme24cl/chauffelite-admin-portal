export default function Header() {
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-800">Admin Portal</h1>
      <button className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600">
        Sign Out
      </button>
    </header>
  );
}
