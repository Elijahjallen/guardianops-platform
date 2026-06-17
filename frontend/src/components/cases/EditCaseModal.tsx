import { useEffect, useState } from "react";
import { getStaff, updateCase } from "../../services/api";

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
  assignedCaseManager?: string | null;
  assignedFieldStaff?: string | null;
  transportDate?: string | null;
  pickupLocation?: string | null;
  destinationLocation?: string | null;
  travelBooked?: boolean;
  flightConfirmation?: string | null;
  hotelConfirmation?: string | null;
  casePriority?: string;
};

type StaffMember = {
  id: string;
  name: string;
  role: string;
  status: string;
};

type EditCaseModalProps = {
  isOpen: boolean;
  caseItem: ApiCase | null;
  onClose: () => void;
  onCaseUpdated: () => void;
};

function EditCaseModal({
  isOpen,
  caseItem,
  onClose,
  onCaseUpdated,
}: EditCaseModalProps) {
  const [caseNumber, setCaseNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [status, setStatus] = useState("Pending");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");

  const [assignedCaseManager, setAssignedCaseManager] = useState("");
  const [assignedFieldStaff, setAssignedFieldStaff] = useState("");
  const [transportDate, setTransportDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destinationLocation, setDestinationLocation] = useState("");
  const [travelBooked, setTravelBooked] = useState(false);
  const [flightConfirmation, setFlightConfirmation] = useState("");
  const [hotelConfirmation, setHotelConfirmation] = useState("");
  const [casePriority, setCasePriority] = useState("Standard");

  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadStaff() {
      try {
        const staff = await getStaff();
        setStaffList(staff);
      } catch (error) {
        console.error("Failed to load staff:", error);
      }
    }

    if (isOpen) {
      loadStaff();
    }
  }, [isOpen]);

  useEffect(() => {
    if (caseItem) {
      setCaseNumber(caseItem.caseNumber);
      setClientName(caseItem.clientName);
      setStatus(caseItem.status);
      setDestination(caseItem.destination);
      setPickupDate(formatInputDate(caseItem.pickupDate));

      setAssignedCaseManager(caseItem.assignedCaseManager || "");
      setAssignedFieldStaff(caseItem.assignedFieldStaff || "");
      setTransportDate(formatInputDate(caseItem.transportDate || ""));
      setPickupLocation(caseItem.pickupLocation || "");
      setDestinationLocation(caseItem.destinationLocation || "");
      setTravelBooked(Boolean(caseItem.travelBooked));
      setFlightConfirmation(caseItem.flightConfirmation || "");
      setHotelConfirmation(caseItem.hotelConfirmation || "");
      setCasePriority(caseItem.casePriority || "Standard");
    }
  }, [caseItem]);

  if (!isOpen || !caseItem) return null;

  const caseManagers = staffList.filter(
    (staff) => staff.role === "Case Manager" && staff.status !== "Inactive"
  );

  const fieldStaff = staffList.filter(
    (staff) => staff.role === "Field Staff" && staff.status !== "Inactive"
  );

  async function handleSave() {
    const selectedCase = caseItem;
    if (!selectedCase) return;

    setMessage("");

    try {
      await updateCase(selectedCase.id, {
        caseNumber,
        clientName,
        status,
        destination,
        pickupDate,

        staffName: undefined,
        assignedCaseManager: assignedCaseManager || undefined,
        assignedFieldStaff: assignedFieldStaff || undefined,
        transportDate: transportDate || undefined,
        pickupLocation: pickupLocation || undefined,
        destinationLocation: destinationLocation || undefined,
        travelBooked,
        flightConfirmation: flightConfirmation || undefined,
        hotelConfirmation: hotelConfirmation || undefined,
        casePriority,
      });

      onCaseUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update case:", error);
      setMessage("Failed to update case.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 px-4 py-8">
      <div className="w-full max-w-5xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Review Case</h2>
            <p className="mt-1 text-slate-500">
              Review intake details, assign staff, confirm transport details,
              and update travel status.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-500 hover:text-slate-950"
          >
            ×
          </button>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-700">
            {message}
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Case Number" value={caseNumber} onChange={setCaseNumber} />
          <Field label="Client Name" value={clientName} onChange={setClientName} />

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

          <Select
            label="Assigned Case Manager"
            value={assignedCaseManager}
            onChange={setAssignedCaseManager}
            options={caseManagers.map((staff) => staff.name)}
            placeholder="Select case manager"
          />

          <Select
            label="Assigned Field Staff"
            value={assignedFieldStaff}
            onChange={setAssignedFieldStaff}
            options={fieldStaff.map((staff) => staff.name)}
            placeholder="Select field staff"
          />

          <Field label="Pickup Date" type="date" value={pickupDate} onChange={setPickupDate} />
          <Field label="Transport Date" type="date" value={transportDate} onChange={setTransportDate} />

          <Field label="Pickup Location" value={pickupLocation} onChange={setPickupLocation} />
          <Field label="Destination Location" value={destinationLocation} onChange={setDestinationLocation} />

          <Field label="Destination" value={destination} onChange={setDestination} />

          <Field label="Flight Confirmation" value={flightConfirmation} onChange={setFlightConfirmation} />
          <Field label="Hotel Confirmation" value={hotelConfirmation} onChange={setHotelConfirmation} />

          <Select
            label="Travel Booked"
            value={travelBooked ? "Yes" : "No"}
            onChange={(value) => setTravelBooked(value === "Yes")}
            options={["No", "Yes"]}
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Save Review
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
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
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

function formatInputDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().split("T")[0];
}

export default EditCaseModal;