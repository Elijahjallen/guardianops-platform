import { useEffect, useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getCaseActivity, getParentCases } from "../services/api";
import MessagesPanel from "../components/messages/MessagesPanel";
import CaseDocumentsPanel from "../components/documents/CaseDocumentsPanel";

type ParentCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
};

type CaseActivity = {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
};

function ParentDashboardPage() {
  const [cases, setCases] = useState<ParentCase[]>([]);
  const [activities, setActivities] = useState<CaseActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadParentPortal() {
      try {
        const caseData = await getParentCases();
        setCases(caseData);

        if (caseData.length > 0) {
          const activityData = await getCaseActivity(caseData[0].id);
          setActivities(activityData);
        }
      } catch (error) {
        console.error("Failed to load parent portal:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadParentPortal();
  }, []);

  const primaryCase = cases[0];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-950">Parent Portal</h1>

        <p className="mt-2 text-slate-500">
          View transport case status, assigned escort, and real-time case updates.
        </p>
      </div>

      {isLoading && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 font-semibold text-slate-500 shadow-sm">
          Loading parent portal...
        </div>
      )}

      {!isLoading && !primaryCase && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            No Cases Available
          </h2>

          <p className="mt-2 text-slate-500">
            No transport cases are currently linked to this parent account.
          </p>
        </div>
      )}

      {primaryCase && (
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold uppercase tracking-wide text-slate-500">
                    Active Case
                  </p>

                  <h2 className="mt-2 text-3xl font-bold text-slate-950">
                    {primaryCase.caseNumber}
                  </h2>
                </div>

                <StatusBadge status={primaryCase.status} />
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Detail label="Client" value={primaryCase.clientName} />
                <Detail label="Destination" value={primaryCase.destination} />
                <Detail
                  label="Assigned Escort"
                  value={primaryCase.staffName || "Pending Assignment"}
                />
                <Detail
                  label="Pickup Date"
                  value={formatDate(primaryCase.pickupDate)}
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">
                Live Case Updates
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Updates are generated from GuardianOps case activity.
              </p>

              <div className="mt-6 space-y-5">
                {activities.map((activity) => (
                  <TimelineItem
                    key={activity.id}
                    title={activity.title}
                    detail={activity.description}
                    footer={`${activity.createdBy} · ${formatDateTime(
                      activity.createdAt
                    )}`}
                  />
                ))}

                {activities.length === 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-semibold text-slate-500">
                    No case updates have been posted yet.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-950">
                All Linked Cases
              </h2>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
                    <tr>
                      <th className="px-5 py-4">Case #</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Destination</th>
                      <th className="px-5 py-4">Pickup</th>
                    </tr>
                  </thead>

                  <tbody>
                    {cases.map((caseItem) => (
                      <tr
                        key={caseItem.id}
                        className="border-t border-slate-100"
                      >
                        <td className="px-5 py-4 font-bold text-slate-950">
                          {caseItem.caseNumber}
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={caseItem.status} />
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {caseItem.destination}
                        </td>

                        <td className="px-5 py-4 text-slate-700">
                          {formatDate(caseItem.pickupDate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <InfoCard title="Emergency Contact">
              <p className="font-semibold text-slate-950">
                GuardianOps Operations
              </p>
              <p className="mt-2 text-slate-600">(208) 555-0188</p>
              <p className="mt-1 text-slate-600">support@guardianops.com</p>
            </InfoCard>

            <MessagesPanel caseId={primaryCase.id} />

            <CaseDocumentsPanel
                caseId={primaryCase.id}
                caseNumber={primaryCase.caseNumber}
            />
          </aside>
        </div>
      )}
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
      <h2 className="mb-4 text-2xl font-bold text-slate-950">{title}</h2>
      {children}
    </section>
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

function TimelineItem({
  title,
  detail,
  footer,
}: {
  title: string;
  detail: string;
  footer: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />

      <div>
        <p className="font-bold text-slate-950">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{detail}</p>
        <p className="mt-2 text-xs font-semibold text-slate-400">{footer}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Scheduled: "bg-purple-100 text-purple-700",
    Pending: "bg-orange-100 text-orange-700",
    "In Progress": "bg-sky-100 text-sky-700",
    "In Transit": "bg-blue-100 text-blue-700",
    "En Route": "bg-blue-100 text-blue-700",
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

function formatDateTime(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default ParentDashboardPage;