import { useState } from "react";
import { useClientStore, type Client } from "../../store/clientStore";

type AddClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const addClient = useClientStore((state) => state.addClient);

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  function handleAddClient() {
    const newClient: Client = {
      id: `CL-${Math.floor(100 + Math.random() * 900)}`,
      name,
      type,
      contact,
      phone,
      email,
      location,
      address,
      notes,
    };

    addClient(newClient);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Add Client</h2>
            <p className="mt-1 text-slate-500">
              Add a new client agency or organization.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-500 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Client Name" value={name} onChange={setName} />
          <Field label="Client Type" value={type} onChange={setType} />
          <Field label="Primary Contact" value={contact} onChange={setContact} />
          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Location" value={location} onChange={setLocation} />
        </div>

        <div className="mt-5">
          <TextArea label="Address" value={address} onChange={setAddress} />
        </div>

        <div className="mt-5">
          <TextArea label="Notes" value={notes} onChange={setNotes} />
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

function TextArea({
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
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-24 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

export default AddClientModal;