const activeCases = [
  {
    caseNumber: "GO-1024",
    client: "M. Reynolds",
    status: "In Transit",
    assignedStaff: "Jordan Lee",
    destination: "Denver, CO",
    lastUpdate: "Airport arrival confirmed",
  },
  {
    caseNumber: "GO-1025",
    client: "A. Parker",
    status: "Pending Pickup",
    assignedStaff: "Taylor Morgan",
    destination: "Phoenix, AZ",
    lastUpdate: "Staff assigned",
  },
  {
    caseNumber: "GO-1026",
    client: "L. Carter",
    status: "Quote Pending",
    assignedStaff: "Unassigned",
    destination: "Boise, ID",
    lastUpdate: "Intake submitted",
  },
];

function ActiveCasesTable() {
  return (
    <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-950">Active Cases</h3>
          <p className="mt-1 text-slate-500">
            Current transport cases requiring operational visibility.
          </p>
        </div>

        <button className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-left text-sm text-slate-500">
              <th className="pb-4">Case #</th>
              <th className="pb-4">Client</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Assigned Staff</th>
              <th className="pb-4">Destination</th>
              <th className="pb-4">Last Update</th>
            </tr>
          </thead>

          <tbody>
            {activeCases.map((caseItem) => (
              <tr
                key={caseItem.caseNumber}
                className="border-b border-slate-100 text-slate-700"
              >
                <td className="py-5 font-bold text-slate-950">
                  {caseItem.caseNumber}
                </td>
                <td className="py-5">{caseItem.client}</td>
                <td className="py-5">
                  <StatusBadge status={caseItem.status} />
                </td>
                <td className="py-5">{caseItem.assignedStaff}</td>
                <td className="py-5">{caseItem.destination}</td>
                <td className="py-5">{caseItem.lastUpdate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const statusStyles: Record<string, string> = {
    "In Transit": "bg-green-100 text-green-700",
    "Pending Pickup": "bg-amber-100 text-amber-700",
    "Quote Pending": "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default ActiveCasesTable;