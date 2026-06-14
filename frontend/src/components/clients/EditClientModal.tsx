import { useEffect, useState } from "react";
import { updateClient } from "../../services/api";

type ApiClient = {
  id: string;
  clientCode: string;
  name: string;
  type: string;
  contact: string;
  phone: string;
  email: string;
  location: string;
};

type EditClientModalProps = {
  isOpen: boolean;
  client: ApiClient | null;
  onClose: () => void;
  onClientUpdated?: () => void;
};

function EditClientModal({
  isOpen,
  client,
  onClose,
  onClientUpdated,
}: EditClientModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (client) {
      setName(client.name);
      setType(client.type);
      setContact(client.contact);
      setPhone(client.phone);
      setEmail(client.email);
      setLocation(client.location);
    }
  }, [client]);

  if (!isOpen || !client) return null;

  async function handleSaveChanges() {
    setErrorMessage("");

    try {
      await updateClient(client.id, {
        clientCode: client.clientCode,
        name,
        type,
        contact,
        phone,
        email,
        location,
      });

      if (onClientUpdated) {
        onClientUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Failed to update client:", error);
      setErrorMessage("Failed to update client. Check backend server.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Edit Client
            </h2>

            <p className="mt-1 text-slate-500">
              Update client details directly in PostgreSQL.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-500 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Client Name" value={name} onChange={setName} />
          <Field label="Client Type" value={type} onChange={setType} />
          <Field
            label="Primary Contact"
            value={contact}
            onChange={setContact}
          />
          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Location" value={location} onChange={setLocation} />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveChanges}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Save Changes
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

export default EditClientModal;