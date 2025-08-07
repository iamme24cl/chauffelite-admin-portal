import CompanySettingsTabs from "../components/settings/CompanySettingsTabs";

export default function CompanySettingsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <CompanySettingsTabs />
      </main>
    </div>
  );
}
