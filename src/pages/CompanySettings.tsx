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

  if (!company) return <p>Loading...</p>

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shandow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Company Settings</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>

      <div>
        <p className="font-medium">Name:</p>
        <p>{company.name}</p>
      </div>

      <div>
        <p className="font-medium">Logo:</p>
        {company.logo_url ? (
          <img src={company.logo_url} alt="Company Logo" className="h-16 mt-2 border rounded" />
        ) : (
          <p className="text-gray-500">No logo uploaded.</p>
        )}
      </div>

      <div>
        <p className="font-medium">Primary Color:</p>
        <div className="w-10 h-5 rounded" style={{ backgroundColor: company.theme?.primary_color || "#000" }} />
      </div>

      <div>
        <p className="font-medium">Secondary Color:</p>
        <div className="w-10 h-5 rounded" style={{ backgroundColor: company.theme?.secondary_color || "#fff" }} />
      </div>

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