import { useEffect, useState } from "react";

import { getCaseStatusCounts } from "../../services/api";

type CaseStatusItem = {
  status: string;
  count: number;
};

function CaseStatusOverview() {
  const [statusData, setStatusData] = useState<CaseStatusItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCaseStatusCounts() {
      try {
        const data = await getCaseStatusCounts();
        setStatusData(data);
      } catch (error) {
        console.error("Failed to load case status counts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCaseStatusCounts();
  }, []);

  const totalCases = statusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Case Status Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live case status totals from PostgreSQL.
          </p>
        </div>

        <span className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
          {totalCases} Total
        </span>
      </div>

      {isLoading && (
        <div className="py-8 text-center font-semibold text-slate-500">
          Loading case status data...
        </div>
      )}

      {!isLoading && statusData.length === 0 && (
        <div className="py-8 text-center font-semibold text-slate-500">
          No case status data available.
        </div>
      )}

      <div className="space-y-5">
        {statusData.map((item) => {
          const percentage = totalCases
            ? Math.round((item.count / totalCases) * 100)
            : 0;

          return (
            <div key={item.status}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-bold text-slate-700">
                  {item.status}
                </span>

                <span className="text-sm font-bold text-slate-500">
                  {item.count} cases · {percentage}%
                </span>
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
      </div>
    </section>
  );
}

export default CaseStatusOverview;