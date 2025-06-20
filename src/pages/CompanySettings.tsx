import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCompany } from "../services/companyService";
import { Company } from "../types";
import CompanySettingsModal from "../components/CompanySettingsModal";
import TeamSettingsCard from "../components/settings/TeamSettingsCard";
import PaymentSettingsCard from "../components/settings/PaymentSettingsCard";
import NotificationsCard from "../components/settings/NotificationsCard";
import SupportSettingsCard from "../components/settings/SupportSettingsCard";

export default function CompanySettingsPage() {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadCompany = async () => {
    if (!user?.company_id) return;
    const data = await fetchCompany(user.company_id);
    setCompany(data);
  };

  useEffect(() => {
    loadCompany();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.company_id]);

  if (!company) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-center text-sm text-gray-500">Loading company settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Company Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your public profile, team, billing, and preferences</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-md shadow-sm"
        >
          Edit Profile
        </button>
      </div>

      {/* Company Info Card */}
      <div className="bg-white border rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-gray-500 mb-1">Company Name</p>
          <p className="text-base font-medium text-gray-800">{company.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Logo</p>
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt="Company Logo"
              className="h-20 w-auto rounded border bg-white object-contain"
            />
          ) : (
            <p className="text-gray-400 italic">No logo uploaded</p>
          )}
        </div>
      </div>

      {/* Other Settings Sections */}
      <TeamSettingsCard />
      <PaymentSettingsCard />
      <NotificationsCard />
      <SupportSettingsCard />

      {/* Modal */}
      <CompanySettingsModal
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={company}
        onSave={async () => {
          await loadCompany();
          setModalOpen(false);
        }}
      />
    </div>
  );
}
