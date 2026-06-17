import { useEffect, useMemo, useState } from "react";
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

type SortKey = "employeeId" | "name" | "role" | "status" | "homeAirport" | "email";
type SortDirection = "asc" | "desc";

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
  const [searchText, setSearchText] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

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

  function handleSort(column: SortKey) {
    if (sortKey === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(column);
    setSortDirection("asc");
  }

  const filteredAndSortedStaff = useMemo(() => {
    const searchValue = searchText.toLowerCase();

    const filtered = staff.filter((member) => {
      const matchesSearch =
        member.employeeId.toLowerCase().includes(searchValue) ||
        member.name.toLowerCase().includes(searchValue) ||
        member.role.toLowerCase().includes(searchValue) ||
        member.status.toLowerCase().includes(searchValue) ||
        member.homeAirport.toLowerCase().includes(searchValue) ||
        member.phone.toLowerCase().includes(searchValue) ||
        member.email.toLowerCase().includes(searchValue);

      const matchesRole =
        roleFilter === "All Roles" || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });

    return [...filtered].sort((a, b) => {
      const aValue = getSortValue(a, sortKey);
      const bValue = getSortValue(b, sortKey);

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [staff, searchText, roleFilter, sortKey, sortDirection]);

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
        <div className="border-b border-slate-200 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-950">
              Employee Directory
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Showing {filteredAndSortedStaff.length} of {staff.length} employees
            </p>
          </div>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search employees..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 xl:max-w-xl"
            />

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 xl:w-[260px]"
            >
              {staffRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <SortableHeader
                  label="Employee ID"
                  sortKeyValue="employeeId"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Name"
                  sortKeyValue="name"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Role"
                  sortKeyValue="role"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Status"
                  sortKeyValue="status"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Home Airport"
                  sortKeyValue="homeAirport"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Contact"
                  sortKeyValue="email"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedStaff.map((member) => (
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

          {!isLoading && filteredAndSortedStaff.length === 0 && (
            <div className="p-8 text-center font-semibold text-slate-500">
              No employees match your search or role filter.
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

function SortableHeader({
  label,
  sortKeyValue,
  activeSortKey,
  direction,
  onSort,
}: {
  label: string;
  sortKeyValue: SortKey;
  activeSortKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeSortKey === sortKeyValue;

  return (
    <th className="px-6 py-4">
      <button
        type="button"
        onClick={() => onSort(sortKeyValue)}
        className="flex items-center gap-2 text-left font-bold uppercase text-slate-600 hover:text-blue-600"
      >
        <span>{label}</span>
        <span className="text-xs">
          {isActive ? (direction === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}

function getSortValue(member: ApiStaffMember, key: SortKey) {
  return member[key].toLowerCase();
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