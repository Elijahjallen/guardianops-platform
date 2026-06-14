import { useEffect, useState } from "react";
import { updateUser } from "../../services/api";

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type EditUserModalProps = {
  isOpen: boolean;
  user: ApiUser | null;
  onClose: () => void;
  onUserUpdated: () => void;
};

function EditUserModal({
  isOpen,
  user,
  onClose,
  onUserUpdated,
}: EditUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  async function handleSave() {
    setMessage("");

    try {
      await updateUser(user.id, {
        name,
        email,
        role,
      });

      onUserUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update user:", error);
      setMessage("Failed to update user.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-950">Edit User</h2>

        {message && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {message}
          </div>
        )}

        <div className="mt-6 space-y-5">
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Email" value={email} onChange={setEmail} />

          <div>
            <label className="mb-2 block font-bold text-slate-950">Role</label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option>Admin</option>
              <option>Employee</option>
              <option>Case Manager</option>
              <option>Field Staff</option>
              <option>Parent</option>
              <option>Client</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Save User
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

export default EditUserModal;