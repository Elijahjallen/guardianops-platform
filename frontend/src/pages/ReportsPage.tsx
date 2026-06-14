import { useEffect, useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getCases, getClients, getStaff } from "../services/api";

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
};

type ApiStaff = {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  status: string;
  homeAirport: string;
};

type ApiClient = {
  id: string;
  clientCode: string;
  name: string;
  type: string;
  location: string;
};

function ReportsPage() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [staff, setStaff] = useState<ApiStaff[]>([]);
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReportsData() {
      try {
        const [caseData, staffData, clientData] = await Promise.all([
          getCases(),
          getStaff(),
          getClients(),
        ]);

        setCases(caseData);
        setStaff(staffData);
        setClients(clientData);
      } catch (error) {
        console.error("Failed to load report data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReportsData();
  }, []);

  const completedCases = cases.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingCases = cases.filter((item) => item.status === "Pending").length;

  const activeStaff = staff.filter(
    (member) => member.status === "Available" || member.status === "En Route"
  ).length;

  const statusList = [
    "Scheduled",
    "Pending",
    "In Progress",
    "In Transit",
    "Completed",
    "Cancelled",
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-950">Reports</h1>

        <p className="mt-2 text-slate-500">
          SQL-backed operational analytics and reporting summaries for
          GuardianOps.
        </p>
      </div>

      {isLoading && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 font-semibold text-slate-500">
          Loading report data from PostgreSQL...
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ReportCard title="Total Cases" value={cases.length.toString()} />
        <ReportCard
          title="Completed Cases"
          value={completedCases.toString()}
        />
        <ReportCard title="Pending Cases" value={pendingCases.toString()} />
        <ReportCard title="Active Staff" value={activeStaff.toString()} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Cases by Status">
          {statusList.map((status) => {
            const count = cases.filter((item) => item.status === status).length;
            const percentage = cases.length ? (count / cases.length) * 100 : 0;

            return (
              <div key={status} className="mb-4">
                <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                  <span>{status}</span>
                  <span>{count}</span>
                </div>

                <div className="h-3 rounded-full bg-slate-100">
                  <div
                    className="h-3 rounded-full bg-blue-600"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </Panel>

        <Panel title="Staff Utilization">
          {staff.map((member) => {
            const assignedCases = cases.filter(
              (caseItem) => caseItem.staffName === member.name
            );

            return (
              <div
                key={member.id}
                className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0"
              >
                <div>
                  <p className="font-bold text-slate-950">{member.name}</p>
                  <p className="text-sm text-slate-500">{member.role}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-950">
                    {assignedCases.length} cases
                  </p>
                  <p className="text-sm text-slate-500">{member.status}</p>
                </div>
              </div>
            );
          })}
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Client Activity">
          {clients.map((client) => {
            const clientCases = cases.filter(
              (caseItem) => caseItem.clientName === client.name
            );

            return (
              <div
                key={client.id}
                className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0"
              >
                <div>
                  <p className="font-bold text-slate-950">{client.name}</p>
                  <p className="text-sm text-slate-500">{client.type}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-950">
                    {clientCases.length} cases
                  </p>
                  <p className="text-sm text-slate-500">{client.location}</p>
                </div>
              </div>
            );
          })}
        </Panel>

        <Panel title="Power BI Ready Data">
          <div className="space-y-4 text-slate-700">
            <p>
              This report is now reading from the PostgreSQL-backed Express API.
            </p>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-bold text-slate-950">Available datasets:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Cases by status</li>
                <li>Cases by client</li>
                <li>Staff utilization</li>
                <li>Upcoming transport dates</li>
                <li>Client activity totals</li>
              </ul>
            </div>
          </div>
        </Panel>
      </section>
    </DashboardLayout>
  );
}

function ReportCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

export default ReportsPage;