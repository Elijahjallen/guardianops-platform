import { useNavigate } from "react-router-dom";

export default function ActiveCasesTable() {
  const navigate = useNavigate();

  const cases = [
    {
      caseNumber: "2026-0014",
      client: "Orange County Schools",
      status: "En Route",
      staff: "Michael Brown",
      destination: "Dallas, TX",
      pickupDate: "May 20, 2026",
      lastUpdate: "2 min ago",
    },
    {
      caseNumber: "2026-0013",
      client: "Safe Harbor Agency",
      status: "Scheduled",
      staff: "Sarah Johnson",
      destination: "Boise, ID",
      pickupDate: "May 20, 2026",
      lastUpdate: "2 min ago",
    },
    {
      caseNumber: "2026-0012",
      client: "Family Services Inc.",
      status: "Pending",
      staff: "David Wilson",
      destination: "Seattle, WA",
      pickupDate: "May 20, 2026",
      lastUpdate: "2 min ago",
    },
    {
      caseNumber: "2026-0011",
      client: "Orange County Schools",
      status: "In Progress",
      staff: "Jennifer Lee",
      destination: "Miami, FL",
      pickupDate: "May 20, 2026",
      lastUpdate: "2 min ago",
    },
    {
      caseNumber: "2026-0010",
      client: "Safe Harbor Agency",
      status: "Completed",
      staff: "Michael Brown",
      destination: "Chicago, IL",
      pickupDate: "May 20, 2026",
      lastUpdate: "2 min ago",
    },
    {
      caseNumber: "2026-0009",
      client: "Family Services Inc.",
      status: "Scheduled",
      staff: "Sarah Johnson",
      destination: "Salt Lake City, UT",
      pickupDate: "May 20, 2026",
      lastUpdate: "2 min ago",
    },
    {
      caseNumber: "2026-0008",
      client: "Orange County Schools",
      status: "Pending",
      staff: "David Wilson",
      destination: "Los Angeles, CA",
      pickupDate: "May 20, 2026",
      lastUpdate: "2 min ago",
    },
    {
      caseNumber: "2026-0007",
      client: "Safe Harbor Agency",
      status: "Cancelled",
      staff: "Jennifer Lee",
      destination: "Phoenix, AZ",
      pickupDate: "May 20, 2026",
      lastUpdate: "2 min ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En Route":
        return "bg-blue-100 text-blue-700";
      case "In Progress":
        return "bg-sky-100 text-sky-700";
      case "Scheduled":
        return "bg-purple-100 text-purple-700";
      case "Pending":
        return "bg-orange-100 text-orange-700";
      case "Completed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-900">
          Active Cases
        </h2>

        <div className="flex gap-4">
          <button
            onClick={() => navigate("/cases")}
            className="rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            View All Cases
          </button>

          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
            + New Case
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Case #
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Client
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Status
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Assigned Staff
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Destination
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Pickup Date
              </th>
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wide text-slate-500">
                Last Update
              </th>
            </tr>
          </thead>

          <tbody>
            {cases.map((item) => (
              <tr
                key={item.caseNumber}
                className="border-b border-slate-100 hover:bg-slate-50"
              >
                <td className="px-8 py-6 text-lg font-bold text-slate-900">
                  {item.caseNumber}
                </td>

                <td className="px-8 py-6 text-lg text-slate-700">
                  {item.client}
                </td>

                <td className="px-8 py-6">
                  <span
                    className={`rounded-xl px-4 py-2 text-sm font-semibold ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-8 py-6 text-lg text-slate-700">
                  {item.staff}
                </td>

                <td className="px-8 py-6 text-lg text-slate-700">
                  {item.destination}
                </td>

                <td className="px-8 py-6 text-lg text-slate-700">
                  {item.pickupDate}
                </td>

                <td className="px-8 py-6 text-lg text-slate-700">
                  {item.lastUpdate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-8">
        <p className="text-lg text-slate-500">
          Showing 1 to 8 of 14 Results
        </p>

        <div className="flex gap-3">
          <button className="h-12 w-12 rounded-xl border border-slate-300 text-slate-600">
            &lt;
          </button>

          <button className="h-12 w-12 rounded-xl bg-blue-600 text-white">
            1
          </button>

          <button className="h-12 w-12 rounded-xl border border-slate-300 text-slate-600">
            2
          </button>

          <button className="h-12 w-12 rounded-xl border border-slate-300 text-slate-600">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}