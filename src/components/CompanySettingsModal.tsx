import { useState } from 'react';
import { CompanyForm, Company } from "../types";
import { updateCompany, uploadCompanyLogo } from '../services/companyService';
import { useAuth } from "../context/AuthContext";

export default function CompanySettingsModal({
  visible,
  onClose,
  initial,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  initial: Company;
  onSave: () => void;
}) {
  const { user } = useAuth();
  const [form, setForm] = useState<CompanyForm>({
    name: initial.name,
    logo_url: initial.logo_url || "",
    theme: {
      primary_color: initial.theme?.primary_color || "#000000",
      secondary_color: initial.theme?.secondary_color || "#ffffff",
    },
  });
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleChange = (field: keyof CompanyForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleThemeChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value,
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Edit Company Settings</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!user?.company_id) return;
            setLoading(true);
            try {
              await updateCompany(user.company_id, form);
              onSave();
            } catch (err) {
              console.error("Failed to update company", err);
            } finally {
              setLoading(false);
            }
          }}
          className="space-y-5"
        >
          {/* Company Name */}
          <div>
            <label className="block mb-1 font-medium">Company Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block mb-1 font-medium">Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file && user?.company_id) {
                  setLoading(true);
                  try {
                    const url = await uploadCompanyLogo(user.company_id, file);
                    handleChange("logo_url", url);
                  } catch (err) {
                    console.error("Upload failed", err);
                  } finally {
                    setLoading(false);
                  }
                }
              }}
              className="block w-full border rounded px-3 py-2"
            />
            {form.logo_url && (
              <img src={form.logo_url} alt="Logo" className="h-16 mt-2 border rounded" />
            )}
          </div>

          {/* Theme Colors */}
          <div className="flex gap-4">
            <div>
              <label className="block mb-1 font-medium">Primary Color</label>
              <input
                type="color"
                value={form.theme?.primary_color || "#000000"}
                onChange={(e) => handleThemeChange("primary_color", e.target.value)}
                className="w-20 h-10"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Secondary Color</label>
              <input
                type="color"
                value={form.theme?.secondary_color || "#ffffff"}
                onChange={(e) => handleThemeChange("secondary_color", e.target.value)}
                className="w-20 h-10"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
