import { useCaseStore, type CaseStatus } from "../../store/caseStore";

const statusConfig: Record<CaseStatus, { label: string; color: string; hex: string }> = {
  "En Route": {
    label: "En Route",
    color: "bg-blue-600",
    hex: "#2563eb",
  },
  "In Progress": {
    label: "In Progress",
    color: "bg-blue-400",
    hex: "#60a5fa",
  },
  Scheduled: {
    label: "Scheduled",
    color: "bg-purple-600",
    hex: "#7c3aed",
  },
  Pending: {
    label: "Pending",
    color: "bg-orange-400",
    hex: "#f59e0b",
  },
  Completed: {
    label: "Completed",
    color: "bg-red-500",
    hex: "#ef4444",
  },
  Cancelled: {
    label: "Cancelled",
    color: "bg-slate-400",
    hex: "#94a3b8",
  },
};

const statusOrder: CaseStatus[] = [
  "En Route",
  "In Progress",
  "Scheduled",
  "Pending",
  "Completed",
  "Cancelled",
];

function CaseStatusOverview() {
  const cases = useCaseStore((state) => state.cases);
  const totalCases = cases.length || 1;

  let currentDegree = 0;

  const statusData = statusOrder.map((status) => {
    const count = cases.filter((caseItem) => caseItem.status === status).length;
    const percent = Math.round((count / totalCases) * 100);
    const degrees = (percent / 100) * 360;

    const segment = `${statusConfig[status].hex} ${currentDegree}deg ${
      currentDegree + degrees
    }deg`;

    currentDegree += degrees;

    return {
      status,
      count,
      percent,
      segment,
    };
  });

  const gradient =
    statusData
      .filter((item) => item.count > 0)
      .map((item) => item.segment)
      .join(", ") || "#e5e7eb 0deg 360deg";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">
        Case Status Overview
      </h2>

      <div className="mt-6 flex items-center gap-6">
        <div
          className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {statusData
            .filter((item) => item.count > 0)
            .map((item) => (
              <div
                key={item.status}
                className="grid grid-cols-[12px_minmax(90px,1fr)_64px] items-center gap-3"
              >
                <span
                  className={`h-3 w-3 rounded ${statusConfig[item.status].color}`}
                />

                <span className="text-sm text-slate-700">
                  {statusConfig[item.status].label}
                </span>

                <span className="text-right text-sm font-semibold text-slate-950">
                  {item.count} ({item.percent}%)
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStatusOverview;