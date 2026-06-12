const pickups = [
  { month: "MAY", day: "20", city: "Dallas, TX", caseNumber: "Case 2026-0014", time: "09:00 AM" },
  { month: "MAY", day: "21", city: "Phoenix, AZ", caseNumber: "Case 2026-0013", time: "10:00 AM" },
  { month: "MAY", day: "22", city: "Houston, TX", caseNumber: "Case 2026-0012", time: "11:00 AM" },
];

function UpcomingPickups() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Upcoming Pickups</h2>

      <div className="mt-6 space-y-4">
        {pickups.map((pickup) => (
          <div key={pickup.caseNumber} className="flex items-center border-b border-slate-200 pb-4 last:border-b-0">
            <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded bg-slate-100">
              <span className="text-xs font-bold text-slate-500">{pickup.month}</span>
              <span className="text-2xl font-bold text-slate-950">{pickup.day}</span>
            </div>

            <div className="ml-4 min-w-0 flex-1">
              <p className="font-bold text-slate-950">{pickup.city}</p>
              <p className="text-sm text-slate-500">{pickup.caseNumber}</p>
            </div>

            <span className="shrink-0 text-sm font-semibold text-blue-600">{pickup.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4 text-center">
        <button className="font-semibold text-blue-600">View Full Schedule</button>
      </div>
    </section>
  );
}

export default UpcomingPickups;