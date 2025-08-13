import { LifeBuoy, FileText, MessageCircle } from "lucide-react";

export default function SupportSettingsCard() {
  return (
    <div className="bg-white rounded-xl shadow border p-6 w-full space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3">
          <LifeBuoy className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Legal & Support</h2>
            <p className="text-sm text-gray-500">
              Access help resources, legal docs, or reach out for support.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded shadow transition">
          <MessageCircle className="w-4 h-4" />
          Contact Support
        </button>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Help Center</p>
          <p className="text-base text-blue-600 underline cursor-pointer">
            Visit our help articles
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Terms of Service</p>
          <p className="text-base text-blue-600 underline cursor-pointer">
            View legal documents
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Privacy Policy</p>
          <p className="text-base text-blue-600 underline cursor-pointer">
            Review our privacy policy
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Contact Us</p>
          <p className="text-base text-blue-600 underline cursor-pointer">
            Chat with support team
          </p>
        </div>
      </div>
    </div>
  );
}
