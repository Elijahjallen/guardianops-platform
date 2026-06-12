const caseStatuses = [
  { name: "En Route", count: 3, percent: "21%", color: "bg-blue-600" },
  { name: "In Progress", count: 2, percent: "14%", color: "bg-blue-400" },
  { name: "Scheduled", count: 4, percent: "29%", color: "bg-purple-600" },
  { name: "Pending", count: 3, percent: "21%", color: "bg-orange-400" },
  { name: "Completed", count: 2, percent: "14%", color: "bg-red-500" },
];

function CaseStatusOverview() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">
        Case Status Overview
      </h2>

      <div className="mt-6 flex items-center gap-6">
        <div
          className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(#2563eb 0deg 82deg, #60a5fa 82deg 132deg, #7c3aed 132deg 236deg, #f59e0b 236deg 312deg, #ef4444 312deg 360deg)",
          }}
        >
          <div className="h-16 w-16 rounded-full bg-white" />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          {caseStatuses.map((item) => (
            <div
              key={item.name}
              className="grid grid-cols-[12px_minmax(90px,1fr)_64px] items-center gap-3"
            >
              <span className={`h-3 w-3 rounded ${item.color}`} />

              <span className="text-sm text-slate-700">
                {item.name}
              </span>

              <span className="text-right text-sm font-semibold text-slate-950">
                {item.count} ({item.percent})
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CaseStatusOverview;