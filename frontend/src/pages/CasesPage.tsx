import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import NewCaseModal from "../components/cases/NewCaseModal";
import { getCases } from "../services/api";

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

function CasesPage() {
  const navigate = useNavigate();

  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  async function loadCases() {
    try {
      setIsLoading(true);
      const data = await getCases();
      setCases(data);
    } catch (error) {
      console.error("Failed to load cases:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  const filters = [
    "All",
    "Scheduled",
    "Pending",
    "In Progress",
    "In Transit",
    "Completed",
    "Cancelled",
  ];

  const filteredCases = cases.filter((item) => {
    const searchValue = searchText.toLowerCase();

    const matchesSearch =
      item.caseNumber.toLowerCase().includes(searchValue) ||
      item.clientName.toLowerCase().includes(searchValue) ||
      item.destination.toLowerCase().includes(searchValue) ||
      (item.staffName || "").toLowerCase().includes(searchValue);

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
                    {item.caseNumber}
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {item.clientName}
                  </td>

                  <td className="px-6 py-5">
                    <StatusBadge status={item.status} />
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {item.staffName || "Unassigned"}
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {item.destination}
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {formatDate(item.pickupDate)}
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

          {isLoading && (
            <div className="p-8 text-center font-semibold text-slate-500">
              Loading cases from database...
            </div>
          )}

          {!isLoading && filteredCases.length === 0 && (
            <div className="p-8 text-center font-semibold text-slate-500">
              No cases match your search or filter.
            </div>
          )}
        </div>
      </section>

      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onCaseCreated={loadCases}
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

export default CasesPage;