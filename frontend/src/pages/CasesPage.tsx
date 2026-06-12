import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import NewCaseModal from "../components/cases/NewCaseModal";
import { useCaseStore, type CaseStatus } from "../store/caseStore";

const filters: ("All" | CaseStatus)[] = [
  "All",
  "En Route",
  "Scheduled",
  "Pending",
  "In Progress",
  "Completed",
  "Cancelled",
];

function CasesPage() {
  const navigate = useNavigate();
  const cases = useCaseStore((state) => state.cases);

  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"All" | CaseStatus>(
    "All"
  );

  const filteredCases = cases.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.client.toLowerCase().includes(searchText.toLowerCase()) ||
      item.staff.toLowerCase().includes(searchText.toLowerCase()) ||
      item.destination.toLowerCase().includes(searchText.toLowerCase());

    const matchesFilter =
      selectedFilter === "All" || item.status === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Cases</h1>

          <p className="mt-2 text-slate-500">
            Manage transport cases, assignments, statuses, and case activity.
          </p>
        </div>

        <button
          onClick={() => setIsNewCaseOpen(true)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          + New Case
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 xl:flex-row xl:items-center xl:justify-between">
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search by case number, client, staff, destination..."
            className="w-full rounded-xl border border-slate-300 px-5 py-3 outline-none xl:max-w-xl"
          />

          <div className="flex flex-wrap gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`rounded-xl px-4 py-2 font-semibold ${
                  selectedFilter === filter
                    ? "bg-blue-600 text-white"
                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Case #</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned Staff</th>
                <th className="px-6 py-4">Destination</th>
                <th className="px-6 py-4">Pickup Date</th>
                <th className="px-6 py-4">Last Update</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredCases.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-5 font-bold text-slate-950">
                    {item.id}
                  </td>

                  <td className="px-6 py-5 text-slate-700">{item.client}</td>

                  <td className="px-6 py-5">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-6 py-5 text-slate-700">{item.staff}</td>

                  <td className="px-6 py-5 text-slate-700">
                    {item.destination}
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {item.pickupDate}
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {item.lastUpdate}
                  </td>

                  <td className="px-6 py-5">
                    <button
                      onClick={() => navigate(`/cases/${item.id}`)}
                      className="font-bold text-blue-600 hover:text-blue-700"
                    >
                      View Case
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredCases.length === 0 && (
            <div className="p-8 text-center font-semibold text-slate-500">
              No cases match your search or filter.
            </div>
          )}
        </div>
      </section>

      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
      />
    </DashboardLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "En Route": "bg-blue-100 text-blue-700",
    Scheduled: "bg-purple-100 text-purple-700",
    Pending: "bg-orange-100 text-orange-700",
    "In Progress": "bg-sky-100 text-sky-700",
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

export default CasesPage;