import { useEffect, useState } from "react";
import {
  useCaseStore,
  type CaseStatus,
  type TransportCase,
} from "../../store/caseStore";
import { useNotificationStore } from "../../store/notificationStore";
import { useStaffStore } from "../../store/staffStore";

type EditCaseModalProps = {
  isOpen: boolean;
  caseItem: TransportCase | null;
  onClose: () => void;
};

function EditCaseModal({ isOpen, caseItem, onClose }: EditCaseModalProps) {
  const updateCase = useCaseStore((state) => state.updateCase);
  const addNotification = useNotificationStore((state) => state.addNotification);
  const staffList = useStaffStore((state) => state.staff);

  const [client, setClient] = useState("");
  const [status, setStatus] = useState<CaseStatus>("Pending");
  const [staff, setStaff] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (caseItem) {
      setClient(caseItem.client);
      setStatus(caseItem.status);
      setStaff(caseItem.staff);
      setPickupLocation(caseItem.pickupLocation);
      setDestination(caseItem.destination);
      setPickupDate(caseItem.pickupDate);
      setPriority(caseItem.priority);
      setNotes(caseItem.notes);
    }
  }, [caseItem]);

  if (!isOpen || !caseItem) return null;

  function handleSaveChanges() {
    updateCase(caseItem.id, {
      client,
      status,
      staff,
      pickupLocation,
      destination,
      pickupDate,
      priority,
      notes,
    });

    addNotification({
      title: "Case updated",
      message: `Case ${caseItem.id} was updated`,
      caseId: caseItem.id,
      type: "info",
    });

    if (caseItem.staff !== staff) {
      addNotification({
        title: "Staff assignment changed",
        message: `Case ${caseItem.id} assigned to ${staff || "Unassigned"}`,
        caseId: caseItem.id,
        type: "info",
      });
    }

    if (caseItem.status !== status) {
      addNotification({
        title: "Case status changed",
        message: `Case ${caseItem.id} changed from ${caseItem.status} to ${status}`,
        caseId: caseItem.id,
        type: status === "Completed" ? "success" : "warning",
      });
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">Edit Case</h2>
            <p className="mt-1 text-slate-500">
              Update case details for {caseItem.id}.
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
          <Field label="Client Name" value={client} onChange={setClient} />

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Status
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as CaseStatus)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option>En Route</option>
              <option>Scheduled</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-bold text-slate-950">
              Assigned Staff
            </label>
            <select
              value={staff}
              onChange={(event) => setStaff(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
            >
              <option value="">Select Staff Member</option>
              {staffList.map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="Pickup Location"
            value={pickupLocation}
            onChange={setPickupLocation}
          />
          <Field
            label="Destination"
            value={destination}
            onChange={setDestination}
          />
          <Field
            label="Pickup Date"
            value={pickupDate}
            onChange={setPickupDate}
          />

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

export default EditCaseModal;