import { useEffect, useState } from "react";
import { getCaseAuditLogs, type AuditLog } from "../../services/api";

type Props = {
  caseId: string;
};

function CaseAuditHistory({ caseId }: Props) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [caseId]);

  async function loadLogs() {
    try {
      const data = await getCaseAuditLogs(caseId);
      setLogs(data);
    } catch (error) {
      console.error("Failed to load audit logs", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        Audit History
      </h2>

      {loading ? (
        <p className="text-sm text-slate-500">Loading audit history...</p>
      ) : logs.length === 0 ? (
        <p className="text-sm text-slate-500">No audit history available.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="rounded-lg border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {log.action}
                </span>

                <span className="text-xs text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-700">{log.description}</p>

              <p className="mt-2 text-xs text-slate-500">
                Performed by: {log.performedBy || "System"}
              </p>

              {(log.oldValue || log.newValue) && (
                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Previous Value
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {log.oldValue || "-"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      New Value
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {log.newValue || "-"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CaseAuditHistory;