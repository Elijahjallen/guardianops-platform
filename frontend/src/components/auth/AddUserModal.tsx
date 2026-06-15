import { useEffect, useState } from "react";
import { api, getClients } from "../../services/api";

type AddUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ClientOption = {
  id: string;
  clientCode: string;
  name: string;
};

function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee");
  const [password, setPassword] = useState("Password123!");
  const [clientName, setClientName] = useState("");
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const needsClientLink = role === "Parent" || role === "Client";

  useEffect(() => {
    if (!isOpen) return;

    async function loadClients() {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Failed to load clients:", error);
        setMessage("Failed to load clients.");
      }
    }

    loadClients();
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleCreateUser() {
    setMessage("");

    if (!name.trim()) {
      setMessage("Name is required.");
      return;
    }

    if (!email.trim()) {
      setMessage("Email is required.");
      return;
    }

    if (!password.trim()) {
      setMessage("Password is required.");
      return;
    }

    if (needsClientLink && !clientName.trim()) {
      setMessage("Parent/Client users must be linked to a client.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("guardianops-token");

      if (!token) {
        setMessage("You must be logged in as an Admin.");
        return;
      }

      await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
          clientName: needsClientLink ? clientName : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("User created successfully.");

      setName("");
      setEmail("");
      setRole("Employee");
      setPassword("Password123!");
      setClientName("");
    } catch (error: any) {
      console.error("Failed to create user:", error);

      const apiMessage =
        error?.response?.data?.message || "Failed to create user.";

      setMessage(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-950">
            Add New User
          </h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-500 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
            {message}
          </div>
        )}

        <div className="space-y-5">
          <Field label="Full Name" value={name} onChange={setName} />

          <Field label="Email Address" value={email} onChange={setEmail} />

          <Field
            label="Temporary Password"
            value={password}
            onChange={setPassword}
          />

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Role
            </label>

            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setClientName("");
              }}
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

          {needsClientLink && (
            <div>
              <label className="mb-2 block font-bold text-slate-950">
                Linked Client
              </label>

              <select
                value={clientName}
                onChange={(event) => setClientName(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
              >
                <option value="">Select client</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name} ({client.clientCode})
                  </option>
                ))}
              </select>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Parent and Client users will only see cases for this client.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateUser}
            disabled={isSubmitting}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create User"}
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
      <label className="mb-2 block font-bold text-slate-950">
        {label}
      </label>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

export default AddUserModal;