import { useEffect, useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  approveQuote,
  declineQuote,
  getCaseActivity,
  getParentCases,
} from "../services/api";
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

  quoteAmount?: number | null;
  quoteStatus?: string | null;
  quoteSentDate?: string | null;
  quoteApprovedDate?: string | null;
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
  const [isQuoteUpdating, setIsQuoteUpdating] = useState(false);

  async function loadParentPortal() {
    try {
      setIsLoading(true);

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

  useEffect(() => {
    loadParentPortal();
  }, []);

  const primaryCase = cases[0];

  async function handleApproveQuote() {
    if (!primaryCase) return;

    const confirmed = window.confirm(
      `Approve the quote for case ${primaryCase.caseNumber}?`
    );

    if (!confirmed) return;

    try {
      setIsQuoteUpdating(true);
      await approveQuote(primaryCase.id);
      await loadParentPortal();
    } catch (error) {
      console.error("Failed to approve quote:", error);
      alert("Failed to approve quote. Please try again.");
    } finally {
      setIsQuoteUpdating(false);
    }
  }

  async function handleDeclineQuote() {
    if (!primaryCase) return;

    const confirmed = window.confirm(
      `Decline the quote for case ${primaryCase.caseNumber}?`
    );

    if (!confirmed) return;

    try {
      setIsQuoteUpdating(true);
      await declineQuote(primaryCase.id);
      await loadParentPortal();
    } catch (error) {
      console.error("Failed to decline quote:", error);
      alert("Failed to decline quote. Please try again.");
    } finally {
      setIsQuoteUpdating(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-950">Parent Portal</h1>

        <p className="mt-2 text-slate-500">
          View transport case status, assigned escort, quote details, and
          real-time case updates.
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
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950">
                    Quote Information
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Review the current quote and approve or decline when ready.
                  </p>
                </div>

                <QuoteStatusBadge status={primaryCase.quoteStatus || "Pending"} />
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <Detail
                  label="Quote Amount"
                  value={formatCurrency(primaryCase.quoteAmount)}
                />
                <Detail
                  label="Quote Status"
                  value={primaryCase.quoteStatus || "Pending"}
                />
                <Detail
                  label="Quote Sent Date"
                  value={formatDate(primaryCase.quoteSentDate)}
                />
                <Detail
                  label="Quote Approved Date"
                  value={formatDate(primaryCase.quoteApprovedDate)}
                />
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleApproveQuote}
                  disabled={
                    isQuoteUpdating ||
                    primaryCase.quoteStatus === "Approved" ||
                    primaryCase.quoteStatus === "Declined"
                  }
                  className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {isQuoteUpdating ? "Updating..." : "Approve Quote"}
                </button>

                <button
                  onClick={handleDeclineQuote}
                  disabled={
                    isQuoteUpdating ||
                    primaryCase.quoteStatus === "Approved" ||
                    primaryCase.quoteStatus === "Declined"
                  }
                  className="rounded-xl border border-red-500 px-6 py-3 font-bold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"
                >
                  Decline Quote
                </button>
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
                      <th className="px-5 py-4">Quote</th>
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

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-950">
                            {formatCurrency(caseItem.quoteAmount)}
                          </p>
                          <div className="mt-2">
                            <QuoteStatusBadge
                              status={caseItem.quoteStatus || "Pending"}
                            />
                          </div>
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

function QuoteStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-gray-100 text-gray-700",
    Drafted: "bg-blue-100 text-blue-700",
    Sent: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Declined: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1 text-sm font-bold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(dateValue?: string | null) {
  if (!dateValue) {
    return "—";
  }

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

function formatCurrency(amount?: number | null) {
  if (amount === null || amount === undefined) {
    return "—";
  }

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default ParentDashboardPage;