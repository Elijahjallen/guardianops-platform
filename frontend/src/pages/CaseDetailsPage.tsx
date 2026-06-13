import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import EditCaseModal from "../components/cases/EditCaseModal";
import { useCaseStore } from "../store/caseStore";
import { useNotificationStore } from "../store/notificationStore";

function CaseDetailsPage() {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const caseItem = useCaseStore((state) =>
    state.cases.find((item) => item.id === caseId)
  );

  const deleteCase = useCaseStore((state) => state.deleteCase);
  const addNotification = useNotificationStore(
    (state) => state.addNotification
  );

  const [isEditOpen, setIsEditOpen] = useState(false);

  if (!caseItem) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">
            Case Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            The case you are looking for does not exist.
          </p>

          <button
            onClick={() => navigate("/cases")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Back to Cases
          </button>
        </div>
      </DashboardLayout>
    );
  }

  function handleDeleteCase() {
    addNotification({
      title: "Case deleted",
      message: `Case ${caseItem.id} was deleted`,
      caseId: caseItem.id,
      type: "danger",
    });

    deleteCase(caseItem.id);
    navigate("/cases");
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/cases")}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Cases
          </button>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Case {caseItem.id}
          </h1>

          <p className="mt-2 text-slate-500">
            View transport details, assignment status, notes, and activity.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="rounded-xl border border-blue-600 px-6 py-3 font-bold text-blue-600 hover:bg-blue-50"
          >
            Edit Case
          </button>

          <button
            onClick={handleDeleteCase}
            className="rounded-xl border border-red-500 px-6 py-3 font-bold text-red-600 hover:bg-red-50"
          >
            Delete Case
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">
              Transport Information
            </h2>

            <StatusBadge status={caseItem.status} />
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Detail label="Client" value={caseItem.client} />
            <Detail label="Status" value={caseItem.status} />
            <Detail label="Assigned Staff" value={caseItem.staff} />
            <Detail label="Priority" value={caseItem.priority} />
            <Detail label="Pickup Date" value={caseItem.pickupDate} />
            <Detail label="Pickup Location" value={caseItem.pickupLocation} />
            <Detail label="Destination" value={caseItem.destination} />
            <Detail label="Last Update" value={caseItem.lastUpdate} />
          </div>

          <div className="mt-8 rounded-2xl bg-slate-50 p-6">
            <h3 className="font-bold text-slate-950">Case Notes</h3>

            <p className="mt-3 text-slate-600">
              {caseItem.notes || "No notes have been added for this case."}
            </p>
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Activity Timeline
          </h2>

          <div className="mt-6 space-y-5">
            <TimelineItem title="Case details viewed" time="Just now" />
            <TimelineItem title={caseItem.lastUpdate} time="Recently" />
            <TimelineItem title="Case assigned" time="3 hrs ago" />
            <TimelineItem title="Case created" time="Earlier" />
          </div>
        </aside>
      </div>

      <EditCaseModal
        isOpen={isEditOpen}
        caseItem={caseItem}
        onClose={() => setIsEditOpen(false)}
      />
    </DashboardLayout>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-slate-950">
        {value || "Not provided"}
      </p>
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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "En Route": "bg-blue-100 text-blue-700",
    Scheduled: "bg-purple-100 text-purple-700",
    Pending: "bg-orange-100 text-orange-700",
    "In Progress": "bg-sky-100 text-sky-700",
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

export default CaseDetailsPage;