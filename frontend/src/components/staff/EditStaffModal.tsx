import { useEffect, useState } from "react";
import {
  useStaffStore,
  type StaffMember,
  type StaffStatus,
} from "../../store/staffStore";

type EditStaffModalProps = {
  isOpen: boolean;
  staffMember: StaffMember | null;
  onClose: () => void;
};

function EditStaffModal({
  isOpen,
  staffMember,
  onClose,
}: EditStaffModalProps) {
  const updateStaff = useStaffStore((state) => state.updateStaff);

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

  useEffect(() => {
    if (staffMember) {
      setName(staffMember.name);
      setRole(staffMember.role);
      setStatus(staffMember.status);
      setLocation(staffMember.location);
      setPhone(staffMember.phone);
      setEmail(staffMember.email);
      setDateOfBirth(staffMember.dateOfBirth);
      setDriversLicense(staffMember.driversLicense);
      setPassport(staffMember.passport);
      setHomeAirport(staffMember.homeAirport);
      setCertifications(staffMember.certifications.join(", "));
      setDegrees(staffMember.degrees.join(", "));
      setDateOfHire(staffMember.dateOfHire);
      setHomeAddress(staffMember.homeAddress);
      setEmergencyContact(staffMember.emergencyContact);
    }
  }, [staffMember]);

  if (!isOpen || !staffMember) {
    return null;
  }

  function handleSaveChanges() {
    updateStaff(staffMember.id, {
      name,
      role,
      status,
      location,
      phone,
      email,
      dateOfBirth,
      driversLicense,
      passport,
      homeAirport,
      certifications: certifications
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      degrees: degrees
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      dateOfHire,
      homeAddress,
      emergencyContact,
    });

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Edit Staff Profile
            </h2>

            <p className="mt-1 text-slate-500">
              Update staff profile, credentials, contact details, and employment
              information.
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
          <Field label="Full Name" value={name} onChange={setName} />
          <Field label="Role" value={role} onChange={setRole} />

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Status
            </label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as StaffStatus)
              }
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
          <Field
            label="Driver's License"
            value={driversLicense}
            onChange={setDriversLicense}
          />
          <Field label="Passport" value={passport} onChange={setPassport} />
          <Field label="Home Airport" value={homeAirport} onChange={setHomeAirport} />
          <Field label="Contact Number" value={phone} onChange={setPhone} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field
            label="Emergency Contact"
            value={emergencyContact}
            onChange={setEmergencyContact}
          />
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-bold text-slate-950">
            Home Address
          </label>

          <textarea
            value={homeAddress}
            onChange={(event) => setHomeAddress(event.target.value)}
            className="h-24 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Certifications
            </label>

            <textarea
              value={certifications}
              onChange={(event) => setCertifications(event.target.value)}
              placeholder="Separate certifications with commas"
              className="h-28 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Degrees
            </label>

            <textarea
              value={degrees}
              onChange={(event) => setDegrees(event.target.value)}
              placeholder="Separate degrees with commas"
              className="h-28 w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none"
            />
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

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

function Field({ label, value, onChange }: FieldProps) {
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