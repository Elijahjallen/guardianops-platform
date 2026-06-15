import { useEffect, useState } from "react";
import { createCase, getClients, getStaff, getUsersForAdmin } from "../../services/api";

type NewCaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated?: () => void;
};

type ClientOption = {
  id: string;
  clientCode: string;
  name: string;
};

type StaffOption = {
  id: string;
  name: string;
  status: string;
};

type UserOption = {
  id: string;
  name: string;
  email: string;
  role: string;
  clientName?: string | null;
};

function NewCaseModal({ isOpen, onClose, onCaseCreated }: NewCaseModalProps) {
  const [caseNumber, setCaseNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [assignedStaff, setAssignedStaff] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [status, setStatus] = useState("Scheduled");
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    async function loadFormData() {
      try {
        const [clientData, staffData, userData] = await Promise.all([
          getClients(),
          getStaff(),
          getUsersForAdmin(),
        ]);

        setClients(clientData);
        setStaff(staffData);
        setUsers(userData);
      } catch (error) {
        console.error("Failed to load new case form data:", error);
        setErrorMessage("Failed to load clients, parents, or staff.");
      }
    }

    loadFormData();
  }, [isOpen]);

  if (!isOpen) return null;

  const availableStaff = staff.filter(
    (member) => member.status === "Available" || member.status === "En Route"
  );

  const linkedParents = users.filter(
    (user) =>
      (user.role === "Parent" || user.role === "Client") &&
      user.clientName === clientName
  );

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

      onCaseCreated?.();
      onClose();
    } catch (error) {
      console.error("Failed to create case:", error);
      setErrorMessage("Failed to create case. Check backend server.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Create New Case
            </h2>

            <p className="mt-1 text-slate-500">
              Select a client, verify linked parent/client access, and assign available staff.
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

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Client Name
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
          </div>

          <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="font-bold text-slate-950">Linked Parent / Client Access</p>

            {!clientName && (
              <p className="mt-2 text-sm font-semibold text-slate-500">
                Select a client to view linked parent or client portal users.
              </p>
            )}

            {clientName && linkedParents.length === 0 && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                No Parent or Client users are currently linked to {clientName}.
              </p>
            )}

            {linkedParents.length > 0 && (
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {linkedParents.map((parent) => (
                  <div
                    key={parent.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <p className="font-bold text-slate-950">{parent.name}</p>
                    <p className="text-sm text-slate-500">{parent.email}</p>
                    <p className="mt-1 text-xs font-bold uppercase text-blue-600">
                      {parent.role}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Assigned Staff
            </label>

            <select
              value={assignedStaff}
              onChange={(event) => setAssignedStaff(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="">Unassigned</option>
              {availableStaff.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name} — {member.status}
                </option>
              ))}
            </select>
          </div>

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