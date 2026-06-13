import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import EditStaffModal from "../components/staff/EditStaffModal";
import { useCaseStore } from "../store/caseStore";
import { useStaffStore, type StaffStatus } from "../store/staffStore";

function StaffDetailsPage() {
  const navigate = useNavigate();
  const { staffId } = useParams();

  const staff = useStaffStore((state) => state.staff);
  const cases = useCaseStore((state) => state.cases);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const staffMember = staff.find((member) => member.id === staffId);

  const assignedCases = staffMember
    ? cases.filter((caseItem) => caseItem.staff === staffMember.name)
    : [];

  if (!staffMember) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">
            Staff Member Not Found
          </h1>

          <button
            onClick={() => navigate("/field-staff")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Back to Field Staff
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
            ← Back to Field Staff
          </button>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            {staffMember.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Staff profile, travel credentials, employment details, and assignments.
          </p>
        </div>

        <button
          onClick={() => setIsEditOpen(true)}
          className="rounded-xl border border-blue-600 px-6 py-3 font-bold text-blue-600 hover:bg-blue-50"
        >
          Edit Staff
        </button>
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
            <Detail label="Staff ID" value={staffMember.id} />
            <Detail label="Date of Hire" value={staffMember.dateOfHire} />
            <Detail label="Current Location" value={staffMember.location} />
            <Detail label="Active Cases" value={assignedCases.length.toString()} />
          </div>
        </aside>

        <div className="space-y-6">
          <InfoCard title="Profile">
            <DetailGrid>
              <Detail label="Full Name" value={staffMember.name} />
              <Detail label="Role" value={staffMember.role} />
              <Detail label="Date of Birth" value={staffMember.dateOfBirth} />
              <Detail label="Status" value={staffMember.status} />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Employment Details">
            <DetailGrid>
              <Detail label="Date of Hire" value={staffMember.dateOfHire} />
              <Detail label="Current Location" value={staffMember.location} />
              <Detail label="Active Cases" value={assignedCases.length.toString()} />
              <Detail label="Home Airport" value={staffMember.homeAirport} />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Travel Credentials">
            <DetailGrid>
              <Detail label="Driver's License" value={staffMember.driversLicense} />
              <Detail label="Passport" value={staffMember.passport} />
              <Detail label="Home Airport" value={staffMember.homeAirport} />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Education & Certifications">
            <DetailGrid>
              <ListDetail label="Certifications" values={staffMember.certifications} />
              <ListDetail label="Degrees" values={staffMember.degrees} />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Contact Information">
            <DetailGrid>
              <Detail label="Contact Number" value={staffMember.phone} />
              <Detail label="Email" value={staffMember.email} />
              <Detail label="Home Address" value={staffMember.homeAddress} />
              <Detail label="Emergency Contact" value={staffMember.emergencyContact} />
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
                        {caseItem.id}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {caseItem.client}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                          {caseItem.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {caseItem.destination}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {caseItem.pickupDate}
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
                  No active cases assigned to this staff member.
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

      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function ListDetail({ label, values }: { label: string; values: string[] }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <ul className="mt-2 list-disc space-y-1 pl-5 font-semibold text-slate-950">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </div>
  );
}

function StatusBadge({ status }: { status: StaffStatus }) {
  const styles: Record<StaffStatus, string> = {
    Available: "bg-green-100 text-green-700",
    "En Route": "bg-blue-100 text-blue-700",
    Busy: "bg-orange-100 text-orange-700",
    "Off Duty": "bg-slate-100 text-slate-700",
  };

  return (
    <span className={`rounded-lg px-3 py-1 text-sm font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default StaffDetailsPage;