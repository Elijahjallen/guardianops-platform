import { useState } from "react";
import { createCase } from "../../services/api";

type NewCaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated?: () => void;
};

function NewCaseModal({ isOpen, onClose, onCaseCreated }: NewCaseModalProps) {
  const [caseNumber, setCaseNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [status, setStatus] = useState("Scheduled");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleCreateCase() {
    setErrorMessage("");

    if (!caseNumber.trim()) {
      setErrorMessage("Case number is required.");
      return;
    }

    if (!clientName.trim()) {
      setErrorMessage("Client name is required.");
      return;
    }

    if (!destination.trim()) {
      setErrorMessage("Destination is required.");
      return;
    }

    if (!pickupDate.trim()) {
      setErrorMessage("Pickup date is required.");
      return;
    }

    try {
      await createCase({
        caseNumber,
        clientName,
        status,
        destination,
        pickupDate,
        staffName: assignedStaff,
      });

      setCaseNumber("");
      setClientName("");
      setAssignedStaff("");
      setDestination("");
      setPickupDate("");
      setStatus("Scheduled");

      if (onCaseCreated) {
        onCaseCreated();
      }

      onClose();
    } catch (error) {
      console.error("Failed to create case:", error);
      setErrorMessage("Failed to create case. Check backend server.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Create New Case
            </h2>

            <p className="mt-1 text-slate-500">
              Save a new transport case directly into PostgreSQL.
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
          <Field
            label="Case Number"
            value={caseNumber}
            onChange={setCaseNumber}
            placeholder="CASE-1003"
          />

          <Field
            label="Client Name"
            value={clientName}
            onChange={setClientName}
            placeholder="Orange County Schools"
          />

          <Field
            label="Assigned Staff"
            value={assignedStaff}
            onChange={setAssignedStaff}
            placeholder="Sarah Johnson"
          />

          <Field
            label="Destination"
            value={destination}
            onChange={setDestination}
            placeholder="Boise, ID"
          />

          <Field
            label="Pickup Date"
            type="date"
            value={pickupDate}
            onChange={setPickupDate}
          />

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Status
            </label>

            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option>Scheduled</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>In Transit</option>
              <option>Completed</option>
              <option>Cancelled</option>
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

export default NewCaseModal;