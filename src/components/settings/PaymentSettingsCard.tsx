import { Banknote, CreditCard } from "lucide-react";

export default function PaymentSettingsCard() {
  return (
    <div className="bg-white rounded-xl shadow border p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Payout & Billing</h2>
            <p className="text-sm text-gray-500">
              Manage your bank details, payout schedule, and invoice history
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded shadow transition">
          <Banknote className="w-4 h-4" />
          Manage Payments
        </button>
      </div>

      {/* Body / Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Connected Bank</p>
          <p className="text-base font-medium text-gray-800">Wells Fargo (****1234)</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Last Payout</p>
          <p className="text-base font-medium text-gray-800">$420.00 on July 1, 2025</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Next Payout</p>
          <p className="text-base font-medium text-gray-800">Scheduled for July 5, 2025</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Invoices</p>
          <p className="text-base text-blue-600 underline cursor-pointer">View past invoices</p>
        </div>
      </div>
    </div>
  );
}
