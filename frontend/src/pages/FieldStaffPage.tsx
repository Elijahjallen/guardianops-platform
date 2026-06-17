import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import AddStaffModal from "../components/staff/AddStaffModal";
import { getStaff } from "../services/api";

type ApiStaffMember = {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  status: string;
  phone: string;
  email: string;
  homeAirport: string;
  createdAt: string;
};

const staffRoles = [
  "All Roles",
  "Admin",
  "Office Manager",
  "Case Manager",
  "Field Staff",
  "HR Manager",
];

function FieldStaffPage() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState<ApiStaffMember[]>([]);
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const filteredStaff =
    roleFilter === "All Roles"
      ? staff
      : staff.filter((member) => member.role === roleFilter);

  async function loadStaff() {
    try {
      setIsLoading(true);
      const data = await getStaff();
      setStaff(data);
    } catch (error) {
      console.error("Failed to load staff:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">
            Staff Directory
          </h1>
          <p className="mt-2 text-slate-500">
            Manage all company employees, roles, availability, assignments, and
            contact information.
          </p>
        </div>

        <button
          onClick={() => setIsAddStaffOpen(true)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Employees" value={staff.length.toString()} />
        <SummaryCard
          title="Case Managers"
          value={staff
            .filter((item) => item.role === "Case Manager")
            .length.toString()}
        />
        <SummaryCard
          title="Field Staff"
          value={staff
            .filter((item) => item.role === "Field Staff")
            .length.toString()}
        />
        <SummaryCard
          title="Available"
          value={staff
            .filter((item) => item.status === "Available")
            .length.toString()}
        />
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Employee Directory
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Showing {filteredStaff.length} of {staff.length} employees
            </p>
          </div>

          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 outline-none lg:w-[260px]"
          >
            {staffRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Employee ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Home Airport</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-5 font-bold text-slate-950">
                    {member.employeeId}
                  </td>

                  <td className="px-6 py-5 font-semibold text-slate-800">
                    {member.name}
                  </td>

                  <td className="px-6 py-5">
                    <RoleBadge role={member.role} />
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={member.status} />
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {member.homeAirport}
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-800">
                      {member.phone}
                    </p>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() => navigate(`/staff-directory/${member.id}`)}
                      className="font-bold text-blue-600 hover:text-blue-700"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isLoading && (
            <div className="p-8 text-center font-semibold text-slate-500">
              Loading staff from database...
            </div>
          )}

          {!isLoading && filteredStaff.length === 0 && (
            <div className="p-8 text-center font-semibold text-slate-500">
              No employees found for this role.
            </div>
          )}
        </div>
      </section>

      <AddStaffModal
        isOpen={isAddStaffOpen}
        onClose={() => setIsAddStaffOpen(false)}
        onStaffCreated={loadStaff}
      />
    </DashboardLayout>
  );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    Admin: "bg-purple-100 text-purple-700",
    "Office Manager": "bg-blue-100 text-blue-700",
    "Case Manager": "bg-amber-100 text-amber-700",
    "Field Staff": "bg-green-100 text-green-700",
    "HR Manager": "bg-pink-100 text-pink-700",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1 text-sm font-bold ${
        styles[role] || "bg-slate-100 text-slate-700"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Available: "bg-green-100 text-green-700",
    "En Route": "bg-blue-100 text-blue-700",
    Busy: "bg-orange-100 text-orange-700",
    "Off Duty": "bg-slate-100 text-slate-700",
    Inactive: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1 text-sm font-bold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default FieldStaffPage;