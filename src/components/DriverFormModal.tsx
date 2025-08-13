import { useState, useEffect } from "react";
import { DriverFormInput } from "../types";
import {
  User,
  Phone,
  Mail,
  KeyRound,
  UserPlus,
  UserCheck,
  X,
} from "lucide-react";

export default function DriverFormModal({
  visible,
  onClose,
  onSubmit,
  initial,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (driver: DriverFormInput) => void;
  initial?: DriverFormInput;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEdit = Boolean(initial);

  useEffect(() => {
    if (visible && initial?.user) {
      setName(initial.user.name || "");
      setPhone(initial.user.phone || "");
      setEmail(initial.user.email || "");
    } else if (!visible) {
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
    }
  }, [visible, initial]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            {isEdit ? (
              <>
                <UserCheck className="w-5 h-5 text-blue-600" />
                Update Driver
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-blue-600" />
                Add Driver
              </>
            )}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({
              user: {
                name,
                phone,
                email: isEdit ? undefined : email,
                password: isEdit ? undefined : password,
              },
            });
            onClose();
          }}
          className="space-y-4"
        >
          {/* Name */}
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          {!isEdit && (
            <>
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                  required
                />
              </div>
            </>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded shadow"
            >
              {isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
