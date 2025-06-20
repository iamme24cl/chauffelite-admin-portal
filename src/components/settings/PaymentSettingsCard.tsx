export default function PaymentSettingsCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-semibold text-gray-800">Payout & Billing</h2>
        <p className="text-sm text-gray-500 mt-1">Bank details, payout setup, invoice history</p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
        Payments
      </button>
    </div>
  );
}
