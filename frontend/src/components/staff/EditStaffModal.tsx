import { useEffect, useState } from "react";
import { updateStaff } from "../../services/api";

type ApiStaffMember = {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  status: string;
  phone: string;
  email: string;
  homeAirport: string;
};

type EditStaffModalProps = {
  isOpen: boolean;
  staffMember: ApiStaffMember | null;
  onClose: () => void;
  onStaffUpdated?: () => void;
};

function EditStaffModal({
  isOpen,
  staffMember,
  onClose,
  onStaffUpdated,
}: EditStaffModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Available");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [homeAirport, setHomeAirport] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (staffMember) {
      setEmployeeId(staffMember.employeeId);
      setName(staffMember.name);
      setRole(staffMember.role);
      setStatus(staffMember.status);
      setPhone(staffMember.phone);
      setEmail(staffMember.email);
      setHomeAirport(staffMember.homeAirport);
    }
  }, [staffMember]);

  if (!isOpen || !staffMember) return null;

  async function handleSaveChanges() {
    setErrorMessage("");

    try {
      if (!staffMember) return;

await updateStaff(staffMember.id, {
        employeeId,
        name,
        role,
        status,
        phone,
        email,
        homeAirport,
      });

      onStaffUpdated?.();
      onClose();
    } catch (error) {
      console.error("Failed to update staff:", error);
      setErrorMessage("Failed to update staff. Check backend server.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-950">
          Edit Staff Member
        </h2>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Employee ID" value={employeeId} onChange={setEmployeeId} />
          <Field label="Full Name" value={name} onChange={setName} />
          <Field label="Role" value={role} onChange={setRole} />

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Status
            </label>

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
          <Field
            label="Home Airport"
            value={homeAirport}
            onChange={setHomeAirport}
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

export default EditStaffModal;