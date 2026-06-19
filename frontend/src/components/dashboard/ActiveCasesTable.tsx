import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCases } from "../../services/api";

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  pickupDate: string;
  casePriority?: string;
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

  const activeCases = cases
    .filter((item) => item.status !== "Completed" && item.status !== "Cancelled")
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const visibleCases = activeCases.slice(0, 6);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 p-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Active Cases</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Newest open cases requiring operational oversight
          </p>
        </div>

        <button
          onClick={() => navigate("/cases")}
          className="rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
        >
          View All Cases
        </button>
      </div>

      <div>
        <table className="w-full table-fixed text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <Header label="Case #" width="w-[18%]" />
              <Header label="Client" width="w-[24%]" />
              <Header label="Status" width="w-[18%]" />
              <Header label="Priority" width="w-[14%]" />
              <Header label="Pickup Date" width="w-[16%]" />
              <Header label="Action" width="w-[10%]" />
            </tr>
          </thead>

          <tbody>
            {visibleCases.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="truncate px-4 py-5 font-bold text-slate-900">
                  {item.caseNumber}
                </td>

                <td className="truncate px-4 py-5 text-slate-700">
                  {item.clientName}
                </td>

                <td className="px-4 py-5">
                  <StatusBadge status={item.status} />
                </td>

                <td className="px-4 py-5">
                  <PriorityBadge priority={item.casePriority || "Standard"} />
                </td>

                <td className="truncate px-4 py-5 text-slate-700">
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
          Showing {visibleCases.length} of {activeCases.length} active cases
        </span>

        <button
          onClick={() => navigate("/cases")}
          className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Manage Cases
        </button>
      </div>
    </div>
  );
}

function Header({ label, width }: { label: string; width: string }) {
  return (
    <th
      className={`${width} px-4 py-3 text-left text-sm font-bold uppercase tracking-wide text-slate-500`}
    >
      {label}
    </th>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Under Review": "bg-amber-100 text-amber-700",
    "Ready For Transport": "bg-indigo-100 text-indigo-700",
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
      className={`inline-block max-w-full truncate rounded-lg px-3 py-1 text-sm font-bold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Standard: "bg-slate-100 text-slate-700",
    High: "bg-orange-100 text-orange-700",
    Urgent: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-block max-w-full truncate rounded-lg px-3 py-1 text-sm font-bold ${
        styles[priority] || "bg-slate-100 text-slate-700"
      }`}
    >
      {priority}
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
  });
}

export default ActiveCasesTable;