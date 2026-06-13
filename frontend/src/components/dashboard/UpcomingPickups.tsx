import { useCaseStore } from "../../store/caseStore";

function UpcomingPickups() {
  const cases = useCaseStore((state) => state.cases);

  const upcomingPickups = cases
    .filter((caseItem) => caseItem.pickupDate)
    .slice(0, 3);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-950">Upcoming Pickups</h2>

      <div className="mt-6 space-y-4">
        {upcomingPickups.map((pickup) => {
          const dateParts = formatPickupDate(pickup.pickupDate);

          return (
            <div
              key={pickup.id}
              className="flex items-center border-b border-slate-200 pb-4 last:border-b-0"
            >
              <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded bg-slate-100">
                <span className="text-xs font-bold text-slate-500">
                  {dateParts.month}
                </span>

                <span className="text-2xl font-bold text-slate-950">
                  {dateParts.day}
                </span>
              </div>

              <div className="ml-4 min-w-0 flex-1">
                <p className="font-bold text-slate-950">
                  {pickup.destination || "Destination pending"}
                </p>

                <p className="text-sm text-slate-500">Case {pickup.id}</p>
              </div>

              <span className="shrink-0 text-sm font-semibold text-blue-600">
                TBD
              </span>
            </div>
          );
        })}

        {upcomingPickups.length === 0 && (
          <p className="py-6 text-center text-sm font-semibold text-slate-500">
            No upcoming pickups scheduled.
          </p>
        )}
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4 text-center">
        <button className="font-semibold text-blue-600">
          View Full Schedule
        </button>
      </div>
    </section>
  );
}

function formatPickupDate(dateValue: string) {
  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      month: "TBD",
      day: "--",
    };
  }

  return {
    month: parsedDate.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: parsedDate.getDate().toString(),
  };
}

export default UpcomingPickups;