import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getAuditLogs } from "../services/api";

type AuditLog = {
  id: string;
  caseId?: string | null;
  caseNumber?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  description: string;
  performedBy: string;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt: string;
};

function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        const data = await getAuditLogs();
        setLogs(data);
      } catch (error) {
        console.error("Failed to load audit logs:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAuditLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const searchValue = searchText.toLowerCase();

    return logs.filter((log) => {
      return (
        log.action.toLowerCase().includes(searchValue) ||
        log.description.toLowerCase().includes(searchValue) ||
        (log.caseNumber || "").toLowerCase().includes(searchValue) ||
        log.performedBy.toLowerCase().includes(searchValue)
      );
    });
  }, [logs, searchText]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-950">Audit Logs</h1>

        <p className="mt-2 text-slate-500">
          Review system activity, case changes, quote approvals, scheduling
          updates, travel changes, and expense modifications.
        </p>
      </div>

      <section className="mb-6 grid gap-6 md:grid-cols-3">
        <AuditCard title="Total Events" value={logs.length.toString()} />
        <AuditCard
          title="Case Updates"
          value={logs
            .filter((log) => log.action.includes("CASE"))
            .length.toString()}
        />
        <AuditCard
          title="Quote Events"
          value={logs
            .filter((log) => log.action.includes("QUOTE"))
            .length.toString()}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search audit logs by action, case number, user, or description..."
            className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Case #</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Performed By</th>
                <th className="px-6 py-4">Old Value</th>
                <th className="px-6 py-4">New Value</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    Loading audit logs...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                      {formatDateTime(log.createdAt)}
                    </td>

                    <td className="px-6 py-5">
                      <ActionBadge action={log.action} />
                    </td>

                    <td className="px-6 py-5 font-bold text-slate-950">
                      {log.caseNumber || "—"}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {log.description}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {log.performedBy}
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {log.oldValue || "—"}
                    </td>

                    <td className="px-6 py-5 text-slate-500">
                      {log.newValue || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

function AuditCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ActionBadge({ action }: { action: string }) {
  const styles: Record<string, string> = {
    CASE_CREATED: "bg-green-100 text-green-700",
    CASE_UPDATED: "bg-blue-100 text-blue-700",
    CASE_DELETED: "bg-red-100 text-red-700",
    STATUS_UPDATED: "bg-purple-100 text-purple-700",
    QUOTE_UPDATED: "bg-yellow-100 text-yellow-700",
    QUOTE_APPROVED: "bg-green-100 text-green-700",
    QUOTE_DECLINED: "bg-red-100 text-red-700",
    SCHEDULING_UPDATED: "bg-indigo-100 text-indigo-700",
    ESCORT_UPDATED: "bg-blue-100 text-blue-700",
    TRAVEL_UPDATED: "bg-cyan-100 text-cyan-700",
    EXPENSE_UPDATED: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1 text-sm font-bold ${
        styles[action] || "bg-slate-100 text-slate-700"
      }`}
    >
      {action.replaceAll("_", " ")}
    </span>
  );
}

function formatDateTime(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default AuditLogsPage;