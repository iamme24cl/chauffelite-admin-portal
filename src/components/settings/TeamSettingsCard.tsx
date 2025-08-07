import { UserPlus, ShieldCheck } from "lucide-react";

const team = [
  { name: "Alice Johnson", role: "Admin" },
  { name: "Bob Singh", role: "Dispatcher" },
  { name: "Carmen Lee", role: "Read-only" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function RoleBadge({ role }: { role: string }) {
  const color =
    role === "Admin"
      ? "bg-green-100 text-green-700"
      : role === "Dispatcher"
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
      {role}
    </span>
  );
}

export default function TeamSettingsCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6 min-h-[300px]">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Team Members
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage admin, dispatcher, and read-only users
          </p>
        </div>
        <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm shadow">
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Team List */}
      <div className="divide-y">
        {team.map((member, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-4 hover:bg-gray-50 px-2 rounded transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                {getInitials(member.name)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {member.name}
                </p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            </div>
            <RoleBadge role={member.role} />
          </div>
        ))}
      </div>
    </div>
  );
}
