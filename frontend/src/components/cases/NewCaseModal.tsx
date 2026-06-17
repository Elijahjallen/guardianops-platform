import { useEffect, useState } from "react";
import {
  createCase,
  getClients,
  getStaff,
  getUsersForAdmin,
} from "../../services/api";

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
  role: string;
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
  const [clientName, setClientName] = useState("");
  const [assignedCaseManager, setAssignedCaseManager] = useState("");
  const [assignedFieldStaff, setAssignedFieldStaff] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [casePriority, setCasePriority] = useState("Standard");

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

  const caseManagers = staff.filter(
    (member) => member.role === "Case Manager" && member.status !== "Inactive"
  );

  const fieldStaff = staff.filter(
    (member) => member.role === "Field Staff" && member.status !== "Inactive"
  );

  const linkedParents = users.filter(
    (user) =>
      (user.role === "Parent" || user.role === "Client") &&
      user.clientName === clientName
  );

  async function handleCreateCase() {
    setErrorMessage("");

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
        clientName,
        status,
        destination,
        pickupDate,
        assignedCaseManager: assignedCaseManager || undefined,
        assignedFieldStaff: assignedFieldStaff || undefined,
        casePriority,
      });

      setClientName("");
      setAssignedCaseManager("");
      setAssignedFieldStaff("");
      setDestination("");
      setPickupDate("");
      setStatus("Pending");
      setCasePriority("Standard");

      onCaseCreated?.();
      onClose();
    } catch (error) {
      console.error("Failed to create case:", error);
      setErrorMessage("Failed to create case. Check backend server.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-8">
      <div className="w-full max-w-4xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Create New Case
            </h2>

            <p className="mt-1 text-slate-500">
              Case number will be generated automatically when the case is
              created.
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

        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
          <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
            Auto-generated case number
          </p>
          <p className="mt-1 text-slate-700">
            GuardianOps will assign the next available case number in the format{" "}
            <span className="font-bold text-slate-950">2026-00000</span>.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
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

          <Select
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              "Pending",
              "Under Review",
              "Scheduled",
              "Ready For Transport",
              "In Transit",
              "Completed",
              "Cancelled",
            ]}
          />

          <Select
            label="Priority"
            value={casePriority}
            onChange={setCasePriority}
            options={["Standard", "High", "Urgent"]}
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

          <Select
            label="Assigned Case Manager"
            value={assignedCaseManager}
            onChange={setAssignedCaseManager}
            options={caseManagers.map((member) => member.name)}
            placeholder="Unassigned"
          />

          <Select
            label="Assigned Field Staff"
            value={assignedFieldStaff}
            onChange={setAssignedFieldStaff}
            options={fieldStaff.map((member) => member.name)}
            placeholder="Unassigned"
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:col-span-2">
            <p className="font-bold text-slate-950">
              Linked Parent / Client Access
            </p>

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

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      >
        {placeholder && <option value="">{placeholder}</option>}

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default NewCaseModal;