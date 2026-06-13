import { useState } from "react";
import {
  useStaffStore,
  type StaffMember,
  type StaffStatus,
} from "../../store/staffStore";

type AddStaffModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const addStaff = useStaffStore((state) => state.addStaff);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<StaffStatus>("Available");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [driversLicense, setDriversLicense] = useState("");
  const [passport, setPassport] = useState("");
  const [homeAirport, setHomeAirport] = useState("");
  const [certifications, setCertifications] = useState("");
  const [degrees, setDegrees] = useState("");
  const [dateOfHire, setDateOfHire] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  if (!isOpen) return null;

  function handleAddStaff() {
    const newStaff: StaffMember = {
      id: `STF-${Math.floor(100 + Math.random() * 900)}`,
      name,
      role,
      status,
      activeCases: 0,
      location,
      phone,
      email,
      dateOfBirth,
      driversLicense,
      passport,
      homeAirport,
      certifications: certifications.split(",").map((x) => x.trim()).filter(Boolean),
      degrees: degrees.split(",").map((x) => x.trim()).filter(Boolean),
      dateOfHire,
      homeAddress,
      emergencyContact,
    };

    addStaff(newStaff);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-950">Add Staff Member</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Full Name" value={name} onChange={setName} />
          <Field label="Role" value={role} onChange={setRole} />

          <div>
            <label className="mb-2 block font-bold text-slate-950">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as StaffStatus)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option>Available</option>
              <option>En Route</option>
              <option>Busy</option>
              <option>Off Duty</option>
            </select>
          </div>

          <Field label="Current Location" value={location} onChange={setLocation} />
          <Field label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} />
          <Field label="Date of Hire" value={dateOfHire} onChange={setDateOfHire} />
          <Field label="Driver's License" value={driversLicense} onChange={setDriversLicense} />
          <Field label="Passport" value={passport} onChange={setPassport} />
          <Field label="Home Airport" value={homeAirport} onChange={setHomeAirport} />
          <Field label="Contact Number" value={phone} onChange={setPhone} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Emergency Contact" value={emergencyContact} onChange={setEmergencyContact} />
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-bold text-slate-950">Home Address</label>
          <textarea
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            className="h-24 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextArea label="Certifications" value={certifications} onChange={setCertifications} />
          <TextArea label="Degrees" value={degrees} onChange={setDegrees} />
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
        onChange={(e) => onChange(e.target.value)}
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
        onChange={(e) => onChange(e.target.value)}
        className="h-28 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

export default AddStaffModal;