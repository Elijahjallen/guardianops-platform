import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import EditCaseModal from "../components/cases/EditCaseModal";
import CaseActivityTimeline from "../components/cases/CaseActivityTimeline";
import { deleteCase, getCaseById } from "../services/api";
import MessagesPanel from "../components/messages/MessagesPanel";
import CaseDocumentsPanel from "../components/documents/CaseDocumentsPanel";

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
  createdAt: string;
};

function CaseDetailsPage() {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const [caseItem, setCaseItem] = useState<ApiCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function loadCase() {
    if (!caseId) return;

    try {
      setIsLoading(true);
      const data = await getCaseById(caseId);
      setCaseItem(data);
    } catch (error) {
      console.error("Failed to load case:", error);
      setCaseItem(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCase();
  }, [caseId]);

  async function handleDeleteCase() {
    if (!caseItem) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${caseItem.caseNumber}?`
    );

    if (!confirmed) return;

    try {
      await deleteCase(caseItem.id);
      navigate("/cases");
    } catch (error) {
      console.error("Failed to delete case:", error);
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 font-semibold text-slate-500 shadow-sm">
          Loading case from database...
        </div>
      </DashboardLayout>
    );
  }

  if (!caseItem) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">Case Not Found</h1>

          <p className="mt-2 text-slate-500">
            The case you are looking for does not exist in PostgreSQL.
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
            Case {caseItem.caseNumber}
          </h1>

          <p className="mt-2 text-slate-500">
            Database-backed transport case details and activity timeline.
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
        <section className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-950">
                Transport Information
              </h2>

              <StatusBadge status={caseItem.status} />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <Detail label="Case Number" value={caseItem.caseNumber} />
              <Detail label="Client" value={caseItem.clientName} />
              <Detail label="Status" value={caseItem.status} />
              <Detail
                label="Assigned Staff"
                value={caseItem.staffName || "Unassigned"}
              />
              <Detail label="Destination" value={caseItem.destination} />
              <Detail
                label="Pickup Date"
                value={formatDate(caseItem.pickupDate)}
              />
              <Detail label="Created" value={formatDate(caseItem.createdAt)} />
            </div>

            <div className="mt-8 rounded-2xl bg-slate-50 p-6">
              <h3 className="font-bold text-slate-950">Database Record</h3>

              <p className="mt-3 text-slate-600">
                This case is being loaded from PostgreSQL through Express and
                Prisma.
              </p>
            </div>
          </div>

          <CaseActivityTimeline
            caseId={caseItem.id}
            caseNumber={caseItem.caseNumber}
          />

          <MessagesPanel caseId={caseItem.id} />
          <CaseDocumentsPanel
            caseId={caseItem.id}
            caseNumber={caseItem.caseNumber}
          />
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Activity Summary
          </h2>

          <div className="mt-6 space-y-5">
            <TimelineItem title="Case loaded from database" time="Just now" />
            <TimelineItem title={`Status: ${caseItem.status}`} time="Current" />
            <TimelineItem
              title={`Assigned to ${caseItem.staffName || "Unassigned"}`}
              time="Current"
            />
            <TimelineItem
              title={`Created ${formatDate(caseItem.createdAt)}`}
              time="Database"
            />
          </div>
        </aside>
      </div>

      <EditCaseModal
        isOpen={isEditOpen}
        caseItem={caseItem}
        onClose={() => setIsEditOpen(false)}
        onCaseUpdated={loadCase}
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

export default CaseDetailsPage;