import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useCaseStore } from "../store/caseStore";

function SchedulingPage() {
  const cases = useCaseStore((state) => state.cases);

  const scheduledCases = cases.filter((item) => item.pickupDate);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Scheduling</h1>
          <p className="mt-2 text-slate-500">
            Manage upcoming pickups, transport dates, and assigned staff.
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">
          + Schedule Transport
        </button>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        <ScheduleCard title="Scheduled Transports" value={scheduledCases.length.toString()} />
        <ScheduleCard
          title="Pending Assignment"
          value={cases.filter((item) => item.staff === "").length.toString()}
        />
        <ScheduleCard
          title="Urgent Priority"
          value={cases.filter((item) => item.priority === "Urgent").length.toString()}
        />
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-950">
            Upcoming Transport Schedule
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Case #</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Pickup Date</th>
                <th className="px-6 py-4">Pickup Location</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Assigned Staff</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {scheduledCases.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-6 py-5 font-bold text-slate-950">{item.id}</td>
                  <td className="px-6 py-5 text-slate-700">{item.client}</td>
                  <td className="px-6 py-5 text-slate-700">{item.pickupDate}</td>
                  <td className="px-6 py-5 text-slate-700">{item.pickupLocation}</td>
                  <td className="px-6 py-5 text-slate-700">{item.destination}</td>
                  <td className="px-6 py-5 text-slate-700">
                    {item.staff || "Unassigned"}
                  </td>
                  <td className="px-6 py-5">
                    <span className="rounded-lg bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {scheduledCases.length === 0 && (
            <div className="p-8 text-center font-semibold text-slate-500">
              No transports scheduled.
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

function ScheduleCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

export default SchedulingPage;