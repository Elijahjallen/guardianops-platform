import { useEffect, useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import EditUserModal from "../components/auth/EditUserModal";
import ResetPasswordModal from "../components/auth/ResetPasswordModal";
import { deleteUser, getUsers } from "../services/api";

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

function UserManagementPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);

  async function loadUsers() {
    try {
      setIsLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleEditUser(user: ApiUser) {
    setSelectedUser(user);
    setIsEditOpen(true);
  }

  function handleResetPassword(user: ApiUser) {
    setSelectedUser(user);
    setIsResetPasswordOpen(true);
  }

  async function handleDeleteUser(user: ApiUser) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) return;

    try {
      await deleteUser(user.id);
      await loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-950">
          User Management
        </h1>

        <p className="mt-2 text-slate-500">
          Manage GuardianOps user accounts, roles, and system access.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-950">System Users</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-5 font-bold text-slate-950">
                    {user.name}
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {user.email}
                  </td>

                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="rounded-lg border border-blue-600 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleResetPassword(user)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Reset Password
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="rounded-lg border border-red-500 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="p-8 text-center font-semibold text-slate-500">
              Loading users from database...
            </div>
          )}

          {!isLoading && users.length === 0 && (
            <div className="p-8 text-center font-semibold text-slate-500">
              No users found.
            </div>
          )}
        </div>
      </section>

      <EditUserModal
        isOpen={isEditOpen}
        user={selectedUser}
        onClose={() => setIsEditOpen(false)}
        onUserUpdated={loadUsers}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        user={selectedUser}
        onClose={() => setIsResetPasswordOpen(false)}
      />
    </DashboardLayout>
  );
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default UserManagementPage;