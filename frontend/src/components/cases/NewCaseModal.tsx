import { useState } from "react";
import { useCaseStore, type TransportCase } from "../../store/caseStore";
import { useNotificationStore } from "../../store/notificationStore";

type NewCaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NewCaseModal({ isOpen, onClose }: NewCaseModalProps) {
  const addCase = useCaseStore((state) => state.addCase);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [clientName, setClientName] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleCreateCase = () => {
    const caseId = `2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newCase: TransportCase = {
      id: caseId,
      client: clientName,
      status: "Pending",
      staff: assignedStaff,
      pickupLocation,
      destination,
      pickupDate,
      priority,
      notes,
      lastUpdate: "Just now",
    };

    addCase(newCase);

    addNotification({
      title: "New case created",
      message: `Case ${caseId} created for ${clientName || "new client"}`,
      caseId,
      type: "success",
    });

    setClientName("");
    setAssignedStaff("");
    setPickupLocation("");
    setDestination("");
    setPickupDate("");
    setPriority("Normal");
    setNotes("");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Create New Case
            </h2>
            <p className="mt-1 text-slate-500">
              Enter transport case details and assignment information.
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
          <Field label="Client Name" value={clientName} onChange={setClientName} />
          <Field label="Assigned Staff" value={assignedStaff} onChange={setAssignedStaff} />
          <Field label="Pickup Location" value={pickupLocation} onChange={setPickupLocation} />
          <Field label="Destination" value={destination} onChange={setDestination} />
          <Field label="Pickup Date" type="date" value={pickupDate} onChange={setPickupDate} />

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Priority
            </label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-bold text-slate-950">Notes</label>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Add case notes..."
            className="h-32 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleCreateCase}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Create Case
          </button>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
};

function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

export default NewCaseModal;