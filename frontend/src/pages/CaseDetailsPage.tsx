import { useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";

function CaseDetailsPage() {
  const { caseId } = useParams();

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="font-semibold text-blue-600">Case Details</p>

        <h1 className="mt-2 text-4xl font-bold text-slate-950">
          Case {caseId}
        </h1>

        <p className="mt-2 text-slate-500">
          View transport details, assignment status, notes, and activity.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Transport Information
          </h2>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Detail label="Client" value="Orange County Schools" />
            <Detail label="Status" value="En Route" />
            <Detail label="Assigned Staff" value="Michael Brown" />
            <Detail label="Pickup Date" value="May 20, 2026" />
            <Detail label="Pickup Location" value="Boise, ID" />
            <Detail label="Destination" value="Dallas, TX" />
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <h3 className="font-bold text-slate-950">Case Notes</h3>
            <p className="mt-3 text-slate-600">
              Transport is currently en route. Field staff confirmed airport
              arrival and client handoff instructions have been reviewed.
            </p>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Activity Timeline
          </h2>

          <div className="mt-6 space-y-5">
            <TimelineItem title="Airport arrival confirmed" time="2 min ago" />
            <TimelineItem title="Staff update received" time="15 min ago" />
            <TimelineItem title="Transport started" time="1 hr ago" />
            <TimelineItem title="Case assigned" time="3 hrs ago" />
            <TimelineItem title="Case created" time="Yesterday" />
          </div>
        </aside>
      </div>
    </DashboardLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function TimelineItem({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex gap-4">
      <span className="mt-1 h-3 w-3 rounded-full bg-blue-600" />

      <div>
        <p className="font-semibold text-slate-950">{title}</p>
        <p className="text-sm text-slate-500">{time}</p>
      </div>
    </div>
  );
}

export default CaseDetailsPage;