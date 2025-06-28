import { useState, useEffect } from 'react';
import { DriverFormInput } from '../types';

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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isEdit = Boolean(initial);

  useEffect(() => {
    if (visible && initial?.user) {
      setName(initial.user.name || '');
      setPhone(initial.user.phone || '');
      setEmail(initial.user.email || '');
    } else if (!visible) {
      // Reset form when modal closes
      setName('');
      setPhone('');
      setEmail('');
      setPassword('');
    }
  }, [visible, initial]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? 'Update Driver' : 'Add Driver'}
        </h2>
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
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Driver name"
            className="w-full mb-4 p-2 border rounded"
            required
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full mb-4 p-2 border rounded"
            required
          />
          {!isEdit && (
            <>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                className="w-full mb-4 p-2 border rounded"
                required
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                className="w-full mb-4 p-2 border rounded"
                required
              />
            </>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
