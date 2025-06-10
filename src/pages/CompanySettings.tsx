import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCompany } from "../services/companyService";
import { Company } from "../types";
import CompanySettingsModal from "../components/CompanySettingsModal";

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

  if (!company) return <p className="text-center py-10">Loading company settings...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Company Settings</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>

      <section>
        <h3 className="text-lg font-medium text-gray-700">General</h3>
        <div className="mt-2 space-y-2">
          <p><strong>Name:</strong> {company.name}</p>
          <p><strong>Logo:</strong></p>
          {company.logo_url ? (
            <img src={company.logo_url} alt="Company Logo" className="h-16 border rounded" />
          ) : (
            <p className="text-gray-500">No logo uploaded</p>
          )}
          <p><strong>Primary Color:</strong> {company.theme?.primary_color}</p>
          <p><strong>Secondary Color:</strong> {company.theme?.secondary_color}</p>
        </div>
      </section>

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