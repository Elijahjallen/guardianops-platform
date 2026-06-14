import { useState } from "react";
import { createStaff } from "../../services/api";

type AddStaffModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStaffCreated?: () => void;
};

function AddStaffModal({ isOpen, onClose, onStaffCreated }: AddStaffModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Available");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [homeAirport, setHomeAirport] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  async function handleAddStaff() {
    setErrorMessage("");

    try {
      await createStaff({
        employeeId,
        name,
        role,
        status,
        phone,
        email,
        homeAirport,
      });

      setEmployeeId("");
      setName("");
      setRole("");
      setStatus("Available");
      setPhone("");
      setEmail("");
      setHomeAirport("");

      onStaffCreated?.();
      onClose();
    } catch (error) {
      console.error("Failed to create staff:", error);
      setErrorMessage("Failed to create staff. Check backend server.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-950">Add Staff Member</h2>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Employee ID" value={employeeId} onChange={setEmployeeId} placeholder="EMP-003" />
          <Field label="Full Name" value={name} onChange={setName} />
          <Field label="Role" value={role} onChange={setRole} />

          <div>
            <label className="mb-2 block font-bold text-slate-950">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option>Available</option>
              <option>En Route</option>
              <option>Busy</option>
              <option>Off Duty</option>
            </select>
          </div>

          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Home Airport" value={homeAirport} onChange={setHomeAirport} placeholder="BOI" />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={handleAddStaff}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Add Staff
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

export default AddStaffModal;