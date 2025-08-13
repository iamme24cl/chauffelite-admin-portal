import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchCompany } from "../../services/companyService";
import { Pencil, Image as ImageIcon, Palette } from "lucide-react";
import CompanySettingsModal from "../settings/CompanySettingsModal";
import { Company } from "../../types";

export default function CompanyProfileCard() {
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
  }, [user?.company_id]);

  if (!company) {
    return (
      <div className="text-sm text-gray-500 text-center py-10">
        Loading company profile...
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Company Profile</h2>
          <p className="text-sm text-gray-500">
            View and update your company details, logo, and theme
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded shadow"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white p-6 rounded-lg shadow border space-y-8 w-full">
        {/* Company Name */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Company Name</p>
          <p className="text-base font-medium text-gray-800">{company.name}</p>
        </div>

        {/* Company Logo */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Company Logo</p>
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt="Company Logo"
              className="h-20 w-auto border bg-white object-contain rounded"
            />
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <ImageIcon className="w-4 h-4" />
              No logo uploaded
            </div>
          )}
        </div>

        {/* Theme Colors */}
        <div>
          <p className="text-sm text-gray-500 mb-2 flex items-center gap-1">
            <Palette className="w-4 h-4 text-blue-500" />
            Theme Colors
          </p>
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Primary</span>
              <div
                className="w-10 h-10 rounded shadow border"
                style={{ backgroundColor: company.theme?.primary_color || "#000000" }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Secondary</span>
              <div
                className="w-10 h-10 rounded shadow border"
                style={{ backgroundColor: company.theme?.secondary_color || "#ffffff" }}
              />
            </div>
          </div>
        </div>
        {/* Tagline */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Tagline</p>
          <p className="text-base font-medium text-gray-800">{company.tagline || "—"}</p>
        </div>

        {/* Description */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-base text-gray-700">{company.description || "—"}</p>
        </div>

        {/* Support Email */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Support Email</p>
          <p className="text-base text-gray-800">{company.support_email || "—"}</p>
        </div>

        {/* Support Phone */}
        <div>
          <p className="text-sm text-gray-500 mb-1">Support Phone</p>
          <p className="text-base text-gray-800">{company.support_phone || "—"}</p>
        </div>
      </div>

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
    </>
  );
}
