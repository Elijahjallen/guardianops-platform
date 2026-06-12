type NewCaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function NewCaseModal({ isOpen, onClose }: NewCaseModalProps) {
  if (!isOpen) {
    return null;
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
              Enter transport case details and assignment information.
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
          <Field label="Client Name" placeholder="Enter client name" />
          <Field label="Assigned Staff" placeholder="Select staff member" />
          <Field label="Pickup Location" placeholder="Enter pickup location" />
          <Field label="Destination" placeholder="Enter destination" />
          <Field label="Pickup Date" type="date" />
          <Field label="Priority" placeholder="Normal / High / Urgent" />
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-bold text-slate-950">Notes</label>

          <textarea
            placeholder="Add case notes..."
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
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Create Case
          </button>
        </div>
      </div>
    </div>
  );
}

type FieldProps = {
  label: string;
  placeholder?: string;
  type?: string;
};

function Field({ label, placeholder, type = "text" }: FieldProps) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-950">{label}</label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
      />
    </div>
  );
}

export default NewCaseModal;