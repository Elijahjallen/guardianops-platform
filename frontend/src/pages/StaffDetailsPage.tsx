import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import EditStaffModal from "../components/staff/EditStaffModal";
import { deleteStaff, getCases, getStaffById } from "../services/api";

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
};

function StaffDetailsPage() {
  const navigate = useNavigate();
  const { staffId } = useParams();

  const [staffMember, setStaffMember] = useState<ApiStaffMember | null>(null);
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function loadStaffDetails() {
    if (!staffId) return;

    try {
      setIsLoading(true);

      const [staffData, caseData] = await Promise.all([
        getStaffById(staffId),
        getCases(),
      ]);

      setStaffMember(staffData);
      setCases(caseData);
    } catch (error) {
      console.error("Failed to load staff details:", error);
      setStaffMember(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadStaffDetails();
  }, [staffId]);

  async function handleDeleteStaff() {
    if (!staffMember) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${staffMember.name}?`
    );

    if (!confirmed) return;

    try {
      await deleteStaff(staffMember.id);
      navigate("/field-staff");
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  }

  const assignedCases = staffMember
    ? cases.filter(
        (caseItem) =>
          caseItem.assignedCaseManager === staffMember.name ||
          caseItem.assignedFieldStaff === staffMember.name ||
          caseItem.staffName === staffMember.name
      )
    : [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 font-semibold text-slate-500 shadow-sm">
          Loading employee profile from database...
        </div>
      </DashboardLayout>
    );
  }

  if (!staffMember) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">
            Employee Not Found
          </h1>

          <button
            onClick={() => navigate("/field-staff")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Back to Staff Directory
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/field-staff")}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Staff Directory
          </button>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            {staffMember.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Database-backed employee profile, role, assignments, and contact
            information.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="rounded-xl border border-blue-600 px-6 py-3 font-bold text-blue-600 hover:bg-blue-50"
          >
            Edit Employee
          </button>

          <button
            onClick={handleDeleteStaff}
            className="rounded-xl border border-red-500 px-6 py-3 font-bold text-red-600 hover:bg-red-50"
          >
            Delete Employee
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {getInitials(staffMember.name)}
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-950">
            {staffMember.name}
          </h2>

          <p className="mt-1 text-slate-500">{staffMember.role}</p>

          <div className="mt-5">
            <StatusBadge status={staffMember.status} />
          </div>

          <div className="mt-8 space-y-5">
            <Detail label="Employee ID" value={staffMember.employeeId} />
            <Detail label="Home Airport" value={staffMember.homeAirport} />
            <Detail label="Assigned Cases" value={assignedCases.length.toString()} />
            <Detail label="Created" value={formatDate(staffMember.createdAt)} />
          </div>
        </aside>

        <div className="space-y-6">
          <InfoCard title="Profile">
            <DetailGrid>
              <Detail label="Full Name" value={staffMember.name} />
              <Detail label="Role" value={staffMember.role} />
              <Detail label="Status" value={staffMember.status} />
              <Detail label="Home Airport" value={staffMember.homeAirport} />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Contact Information">
            <DetailGrid>
              <Detail label="Phone" value={staffMember.phone} />
              <Detail label="Email" value={staffMember.email} />
            </DetailGrid>
          </InfoCard>

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Assigned Cases
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
                  <tr>
                    <th className="px-6 py-4">Case #</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4">Pickup Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {assignedCases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-bold text-slate-950">
                        {caseItem.caseNumber}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {caseItem.clientName}
                      </td>

                      <td className="px-6 py-5">
                        <StatusBadge status={caseItem.status} />
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {caseItem.destination}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {formatDate(caseItem.pickupDate)}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => navigate(`/cases/${caseItem.id}`)}
                          className="font-bold text-blue-600 hover:text-blue-700"
                        >
                          View Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {assignedCases.length === 0 && (
                <div className="p-8 text-center font-semibold text-slate-500">
                  No cases assigned to this employee.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <EditStaffModal
        isOpen={isEditOpen}
        staffMember={staffMember}
        onClose={() => setIsEditOpen(false)}
        onStaffUpdated={loadStaffDetails}
      />
    </DashboardLayout>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-bold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-slate-950">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Available: "bg-green-100 text-green-700",
    "En Route": "bg-blue-100 text-blue-700",
    Busy: "bg-orange-100 text-orange-700",
    "Off Duty": "bg-slate-100 text-slate-700",
    Inactive: "bg-red-100 text-red-700",
    Scheduled: "bg-purple-100 text-purple-700",
    Pending: "bg-orange-100 text-orange-700",
    "In Progress": "bg-sky-100 text-sky-700",
    "In Transit": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
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

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default StaffDetailsPage;