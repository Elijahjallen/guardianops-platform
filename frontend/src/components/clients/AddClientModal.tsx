import { useState } from "react";
import { createClient } from "../../services/api";

type AddClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated?: () => void;
};

function AddClientModal({ isOpen, onClose, onClientCreated }: AddClientModalProps) {
  const [clientCode, setClientCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleAddClient() {
    setErrorMessage("");

    try {
      await createClient({
        clientCode,
        name,
        type,
        contact,
        phone,
        email,
        location,
      });

      setClientCode("");
      setName("");
      setType("");
      setContact("");
      setPhone("");
      setEmail("");
      setLocation("");

      onClientCreated?.();
      onClose();
    } catch (error) {
      console.error("Failed to create client:", error);
      setErrorMessage("Failed to create client. Check backend server.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-950">Add Client</h2>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Client Code" value={clientCode} onChange={setClientCode} placeholder="CL-004" />
          <Field label="Client Name" value={name} onChange={setName} />
          <Field label="Client Type" value={type} onChange={setType} />
          <Field label="Primary Contact" value={contact} onChange={setContact} />
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
            onClick={handleAddClient}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Add Client
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
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

export default AddClientModal;