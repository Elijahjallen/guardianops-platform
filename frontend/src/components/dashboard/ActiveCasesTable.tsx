import MichaelBrown from "../../assets/avatars/Michael-Brown.png";
import SarahJohnson from "../../assets/avatars/Sarah-Johnson.png";
import DavidWilson from "../../assets/avatars/David-Wilson.png";
import JenniferLee from "../../assets/avatars/Jennifer-Lee.png";

const cases = [
  {
    id: "2026-0014",
    client: "Orange County Schools",
    status: "En Route",
    statusColor: "bg-blue-100 text-blue-700",
    staff: "Michael Brown",
    avatar: MichaelBrown,
    destination: "Dallas, TX",
    pickupDate: "May 20, 2026",
    lastUpdate: "2 min ago",
  },
  {
    id: "2026-0013",
    client: "Safe Harbor Agency",
    status: "Scheduled",
    statusColor: "bg-purple-100 text-purple-700",
    staff: "Sarah Johnson",
    avatar: SarahJohnson,
    destination: "Boise, ID",
    pickupDate: "May 20, 2026",
    lastUpdate: "2 min ago",
  },
  {
    id: "2026-0012",
    client: "Family Services Inc.",
    status: "Pending",
    statusColor: "bg-orange-100 text-orange-700",
    staff: "David Wilson",
    avatar: DavidWilson,
    destination: "Seattle, WA",
    pickupDate: "May 20, 2026",
    lastUpdate: "2 min ago",
  },
  {
    id: "2026-0011",
    client: "Orange County Schools",
    status: "In Progress",
    statusColor: "bg-blue-100 text-blue-700",
    staff: "Jennifer Lee",
    avatar: JenniferLee,
    destination: "Miami, FL",
    pickupDate: "May 20, 2026",
    lastUpdate: "2 min ago",
  },
  {
    id: "2026-0010",
    client: "Safe Harbor Agency",
    status: "Completed",
    statusColor: "bg-green-100 text-green-700",
    staff: "Michael Brown",
    avatar: MichaelBrown,
    destination: "Chicago, IL",
    pickupDate: "May 20, 2026",
    lastUpdate: "2 min ago",
  },
  {
    id: "2026-0009",
    client: "Family Services Inc.",
    status: "Scheduled",
    statusColor: "bg-purple-100 text-purple-700",
    staff: "Sarah Johnson",
    avatar: SarahJohnson,
    destination: "Salt Lake City, UT",
    pickupDate: "May 20, 2026",
    lastUpdate: "2 min ago",
  },
  {
    id: "2026-0008",
    client: "Orange County Schools",
    status: "Pending",
    statusColor: "bg-orange-100 text-orange-700",
    staff: "David Wilson",
    avatar: DavidWilson,
    destination: "Los Angeles, CA",
    pickupDate: "May 20, 2026",
    lastUpdate: "2 min ago",
  },
  {
    id: "2026-0007",
    client: "Safe Harbor Agency",
    status: "Cancelled",
    statusColor: "bg-red-100 text-red-600",
    staff: "Jennifer Lee",
    avatar: JenniferLee,
    destination: "Phoenix, AZ",
    pickupDate: "May 20, 2026",
    lastUpdate: "2 min ago",
  },
];

function ActiveCasesTable() {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Active Cases
        </h2>

        <div className="flex gap-3">
          <button className="rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50">
            View All Cases
          </button>

          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            + New Case
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr className="text-sm font-semibold uppercase tracking-wide text-slate-600">
              <th className="px-4 py-3">Case #</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned Staff</th>
              <th className="px-4 py-3">Destination</th>
              <th className="px-4 py-3">Pickup Date</th>
              <th className="px-4 py-3">Last Update</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {cases.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-4 py-5 font-semibold text-slate-900">
                  {item.id}
                </td>

                <td className="px-4 py-5 text-slate-700">
                  {item.client}
                </td>

                <td className="px-4 py-5">
                  <span
                    className={`rounded-lg px-3 py-1 text-sm font-semibold ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.avatar}
                      alt={item.staff}
                      className="h-10 w-10 rounded-full object-cover"
                    />

                    <span className="font-medium text-slate-700">
                      {item.staff}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-5 text-slate-700">
                  {item.destination}
                </td>

                <td className="px-4 py-5 text-slate-700">
                  {item.pickupDate}
                </td>

                <td className="px-4 py-5 text-slate-700">
                  {item.lastUpdate}
                </td>

                <td className="px-4 py-5 text-center text-xl text-slate-400">
                  ...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-5 text-sm text-slate-600">
        <span>Showing 1 to 8 of 14 Results</span>

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

export default ActiveCasesTable;