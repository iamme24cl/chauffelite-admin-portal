import { useState } from "react";
import { CompanyForm, Company } from "../../types";
import { updateCompany, uploadCompanyLogo } from "../../services/companyService";
import { useAuth } from "../../context/AuthContext";
import {
  Building2,
  ImagePlus,
  Palette,
  Save,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

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
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 sm:p-8 animate-fadeIn max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <Building2 className="w-6 h-6 text-blue-600" />
          Edit Company Settings
        </h2>

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
        >
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <Building2 className="w-4 h-4 text-blue-500" />
                Company Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:ring-blue-100 focus:outline-none"
                required
              />
            </div>

            {/* Theme Colors */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                <Palette className="w-4 h-4 text-blue-500" />
                Theme Colors
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Primary</span>
                  <input
                    type="color"
                    value={form.theme?.primary_color || "#000000"}
                    onChange={(e) => handleThemeChange("primary_color", e.target.value)}
                    className="w-10 h-10 rounded shadow"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Secondary</span>
                  <input
                    type="color"
                    value={form.theme?.secondary_color || "#ffffff"}
                    onChange={(e) => handleThemeChange("secondary_color", e.target.value)}
                    className="w-10 h-10 rounded shadow"
                  />
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="col-span-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-2">
                <ImagePlus className="w-4 h-4 text-blue-500" />
                Company Logo
              </label>
              <div className="flex items-center gap-4">
                {form.logo_url ? (
                  <img
                    src={form.logo_url}
                    alt="Company Logo"
                    className="h-16 w-16 rounded-full border object-cover"
                  />
                ) : (
                  <div className="h-16 w-16 flex items-center justify-center border rounded-full bg-gray-100 text-gray-400">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
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
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              <XCircle className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
