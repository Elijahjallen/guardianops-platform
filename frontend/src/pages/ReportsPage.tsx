import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useCaseStore } from "../store/caseStore";
import { useStaffStore } from "../store/staffStore";

function ReportsPage() {
  const cases = useCaseStore((state) => state.cases);
  const staff = useStaffStore((state) => state.staff);

  const completedCases = cases.filter((item) => item.status === "Completed").length;
  const pendingCases = cases.filter((item) => item.status === "Pending").length;
  const activeStaff = staff.filter(
    (member) => member.status === "Available" || member.status === "En Route"
  ).length;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-950">Reports</h1>
        <p className="mt-2 text-slate-500">
          Operational analytics and reporting summaries for GuardianOps.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ReportCard title="Total Cases" value={cases.length.toString()} />
        <ReportCard title="Completed Cases" value={completedCases.toString()} />
        <ReportCard title="Pending Cases" value={pendingCases.toString()} />
        <ReportCard title="Active Staff" value={activeStaff.toString()} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Cases by Status">
          {["En Route", "Scheduled", "Pending", "In Progress", "Completed", "Cancelled"].map(
            (status) => {
              const count = cases.filter((item) => item.status === status).length;

              return (
                <div key={status} className="mb-4">
                  <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                    <span>{status}</span>
                    <span>{count}</span>
                  </div>

                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className="h-3 rounded-full bg-blue-600"
                      style={{
                        width: `${cases.length ? (count / cases.length) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </Panel>

        <Panel title="Staff Utilization">
          {staff.map((member) => (
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
                  {member.activeCases} cases
                </p>
                <p className="text-sm text-slate-500">{member.status}</p>
              </div>
            </div>
          ))}
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