import { useState } from "react";
import { BellRing, Mail, Smartphone, Bell } from "lucide-react";

export default function NotificationsCard() {
  const [settings, setSettings] = useState({
    bookingUpdates: true,
    scheduleChanges: false,
    rideReminders: true,
    promoEmails: false,
    smsAlerts: true,
    pushNotifications: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <BellRing className="w-6 h-6 text-blue-600" />
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Notification Preferences</h2>
          <p className="text-sm text-gray-500">Manage how and when you get notified.</p>
        </div>
      </div>

      {/* Email Notifications */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium">
          <Mail className="w-4 h-4 text-blue-500" />
          Email Notifications
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleItem
            label="Booking Confirmations"
            value={settings.bookingUpdates}
            onChange={() => toggle("bookingUpdates")}
          />
          <ToggleItem
            label="Schedule Changes"
            value={settings.scheduleChanges}
            onChange={() => toggle("scheduleChanges")}
          />
          <ToggleItem
            label="Ride Reminders"
            value={settings.rideReminders}
            onChange={() => toggle("rideReminders")}
          />
          <ToggleItem
            label="Promotional Emails"
            value={settings.promoEmails}
            onChange={() => toggle("promoEmails")}
          />
        </div>
      </div>

      {/* SMS Alerts */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium">
          <Smartphone className="w-4 h-4 text-blue-500" />
          SMS Alerts
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleItem
            label="Send SMS for critical ride updates"
            value={settings.smsAlerts}
            onChange={() => toggle("smsAlerts")}
          />
        </div>
      </div>

      {/* Push Notifications */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-gray-600 font-medium">
          <Bell className="w-4 h-4 text-blue-500" />
          Push Notifications
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleItem
            label="Receive push alerts in the mobile app"
            value={settings.pushNotifications}
            onChange={() => toggle("pushNotifications")}
          />
        </div>
      </div>
    </div>
  );
}

// ToggleItem component
function ToggleItem({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded border hover:shadow transition">
      <span className="text-sm text-gray-700">{label}</span>
      <label className="relative inline-block w-11 h-6 cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={value}
          onChange={onChange}
        />
        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-5" />
      </label>
    </div>
  );
}

