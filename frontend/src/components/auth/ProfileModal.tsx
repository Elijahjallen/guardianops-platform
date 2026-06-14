type ProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const storedUser = localStorage.getItem("guardianops-user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-950">My Profile</h2>

          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-500 hover:text-slate-900"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          <Detail label="Name" value={user?.name || "Not available"} />
          <Detail label="Email" value={user?.email || "Not available"} />
          <Detail label="Role" value={user?.role || "Not available"} />
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

export default ProfileModal;