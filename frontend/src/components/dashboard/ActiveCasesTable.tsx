import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCases } from "../../services/api";

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

function ActiveCasesTable() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      try {
        const data = await getCases();
        setCases(data);
      } catch (error) {
        console.error("Failed to load active cases:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCases();
  }, []);

  const visibleCases = cases.slice(0, 8);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-900">Active Cases</h2>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/cases")}
            className="rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            View All Cases
          </button>

          <button
            onClick={() => navigate("/cases")}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            + New Case
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Case #
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Client
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Assigned Staff
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Destination
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Pickup Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleCases.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-5 font-bold text-slate-900">
                  {item.caseNumber}
                </td>

                <td className="px-4 py-5 text-slate-700">
                  {item.clientName}
                </td>

                <td className="px-4 py-5">
                  <StatusBadge status={item.status} />
                </td>

                <td className="px-4 py-5 text-slate-700">
                  {item.staffName || "Unassigned"}
                </td>

                <td className="px-4 py-5 text-slate-700">
                  {item.destination}
                </td>

                <td className="px-4 py-5 text-slate-700">
                  {formatDate(item.pickupDate)}
                </td>

                <td className="px-4 py-5">
                  <button
                    onClick={() => navigate(`/cases/${item.id}`)}
                    className="font-bold text-blue-600 hover:text-blue-700"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isLoading && (
          <div className="p-8 text-center font-semibold text-slate-500">
            Loading cases from database...
          </div>
        )}

        {!isLoading && visibleCases.length === 0 && (
          <div className="p-8 text-center font-semibold text-slate-500">
            No active cases available.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 p-5 text-sm text-slate-600">
        <span>
          Showing {visibleCases.length === 0 ? 0 : 1} to {visibleCases.length} of{" "}
          {cases.length} Results
        </span>

        <div className="flex items-center gap-2">
          <button className="h-10 w-10 rounded-lg border border-slate-200">
            &lt;
          </button>

          <button className="h-10 w-10 rounded-lg bg-blue-600 text-white">
            1
          </button>

          <button className="h-10 w-10 rounded-lg border border-slate-200">
            2
          </button>

          <button className="h-10 w-10 rounded-lg border border-slate-200">
            &gt;
          </button>
        </div>
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

export default ActiveCasesTable;