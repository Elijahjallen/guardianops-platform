import { useState } from "react";
import { resetUserPassword } from "../../services/api";

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type ResetPasswordModalProps = {
  isOpen: boolean;
  user: ApiUser | null;
  onClose: () => void;
};

function ResetPasswordModal({ isOpen, user, onClose }: ResetPasswordModalProps) {
  const [password, setPassword] = useState("Password123!");
  const [message, setMessage] = useState("");

  if (!isOpen || !user) return null;

  async function handleResetPassword() {
    setMessage("");

    try {
      if (!user) return;

await resetUserPassword(user.id, password);
      setMessage("Password reset successfully.");
    } catch (error) {
      console.error("Failed to reset password:", error);
      setMessage("Failed to reset password.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-slate-950">Reset Password</h2>

        <p className="mt-2 text-slate-500">
          Reset password for {user.name}.
        </p>

        {message && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-700">
            {message}
          </div>
        )}

        <div className="mt-6">
          <label className="mb-2 block font-bold text-slate-950">
            New Password
          </label>

          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none"
          />
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700"
          >
            Close
          </button>

          <button
            onClick={handleResetPassword}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal;