import { useEffect, useState } from "react";
import { updateCase } from "../../services/api";

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
};

type EditCaseModalProps = {
  isOpen: boolean;
  caseItem: ApiCase | null;
  onClose: () => void;
  onCaseUpdated?: () => void;
};

function EditCaseModal({
  isOpen,
  caseItem,
  onClose,
  onCaseUpdated,
}: EditCaseModalProps) {
  const [caseNumber, setCaseNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [status, setStatus] = useState("Scheduled");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (caseItem) {
      setCaseNumber(caseItem.caseNumber);
      setClientName(caseItem.clientName);
      setAssignedStaff(caseItem.staffName || "");
      setDestination(caseItem.destination);
      setPickupDate(formatDateForInput(caseItem.pickupDate));
      setStatus(caseItem.status);
    }
  }, [caseItem]);

  if (!isOpen || !caseItem) return null;

  async function handleSaveChanges() {
    setErrorMessage("");

    try {
      if (!caseItem) return;

await updateCase(caseItem.id, {
        caseNumber,
        clientName,
        status,
        destination,
        pickupDate,
        staffName: assignedStaff,
      });

      if (onCaseUpdated) {
        onCaseUpdated();
      }

      onClose();
    } catch (error) {
      console.error("Failed to update case:", error);
      setErrorMessage("Failed to update case. Check backend server.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Edit Case</h2>
            <p className="mt-1 text-slate-500">
              Update this case directly in PostgreSQL.
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
          <Field label="Case Number" value={caseNumber} onChange={setCaseNumber} />
          <Field label="Client Name" value={clientName} onChange={setClientName} />
          <Field
            label="Assigned Staff"
            value={assignedStaff}
            onChange={setAssignedStaff}
          />
          <Field label="Destination" value={destination} onChange={setDestination} />
          <Field
            label="Pickup Date"
            type="date"
            value={pickupDate}
            onChange={setPickupDate}
          />

          <div>
            <label className="mb-2 block font-bold text-slate-950">Status</label>
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

function formatDateForInput(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export default EditCaseModal;