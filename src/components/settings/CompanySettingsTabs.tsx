import { useState } from "react";
import {
  Building2,
  Users,
  CreditCard,
  Bell,
  LifeBuoy,
} from "lucide-react";

import TeamSettingsCard from "../settings/TeamSettingsCard";
import PaymentSettingsCard from "../settings/PaymentSettingsCard";
import NotificationsCard from "../settings/NotificationsCard";
import SupportSettingsCard from "../settings/SupportSettingsCard";
import CompanyProfileCard from "../settings/CompanyProfileCard";

const tabs = [
  { key: "billing", label: "Billing", icon: CreditCard },
  { key: "support", label: "Support", icon: LifeBuoy },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "team", label: "Team", icon: Users },
  { key: "profile", label: "Profile", icon: Building2 },
];

export default function CompanySettingsTabs() {
  const [activeTab, setActiveTab] = useState("notifications");

  return (
    <div className="min-h-[75vh] w-full animate-fadeIn">
      {/* Tabs Header */}
      <div className="flex border-b mb-6 overflow-x-auto">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition border-b-2 ${
              activeTab === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "billing" && <PaymentSettingsCard />}
        {activeTab === "support" && <SupportSettingsCard />}
        {activeTab === "notifications" && <NotificationsCard />}
        {activeTab === "team" && <TeamSettingsCard />}
        {activeTab === "profile" && <CompanyProfileCard />}
      </div>
    </div>
  );
}
