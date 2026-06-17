import { useEffect, useMemo, useState } from "react";
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
  assignedCaseManager?: string | null;
  assignedFieldStaff?: string | null;
  travelBooked?: boolean;
  casePriority?: string;
  createdAt: string;
};

type SortKey =
  | "caseNumber"
  | "clientName"
  | "status"
  | "casePriority"
  | "assignedCaseManager"
  | "assignedFieldStaff"
  | "travelBooked"
  | "destination"
  | "pickupDate";

type SortDirection = "asc" | "desc";

function CasesPage() {
  const navigate = useNavigate();

  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("pickupDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

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
    "Pending",
    "Under Review",
    "Scheduled",
    "Ready For Transport",
    "In Transit",
    "Completed",
    "Cancelled",
  ];

  function handleSort(column: SortKey) {
    if (sortKey === column) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(column);
    setSortDirection("asc");
  }

  const filteredAndSortedCases = useMemo(() => {
    const searchValue = searchText.toLowerCase();

    const filtered = cases.filter((item) => {
      const matchesSearch =
        item.caseNumber.toLowerCase().includes(searchValue) ||
        item.clientName.toLowerCase().includes(searchValue) ||
        item.destination.toLowerCase().includes(searchValue) ||
        (item.assignedCaseManager || "").toLowerCase().includes(searchValue) ||
        (item.assignedFieldStaff || "").toLowerCase().includes(searchValue) ||
        (item.casePriority || "").toLowerCase().includes(searchValue);

      const matchesFilter =
        selectedFilter === "All" || item.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      const aValue = getSortValue(a, sortKey);
      const bValue = getSortValue(b, sortKey);

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [cases, searchText, selectedFilter, sortKey, sortDirection]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Cases</h1>

          <p className="mt-2 text-slate-500">
            Manage transport cases, assignments, statuses, travel readiness, and
            case activity.
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
        <div className="border-b border-slate-200 p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search cases..."
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 xl:max-w-xl"
            />

            <select
              value={selectedFilter}
              onChange={(event) => setSelectedFilter(event.target.value)}
              className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 xl:w-[260px]"
            >
              {filters.map((filter) => (
                <option key={filter} value={filter}>
                  {filter === "All" ? "All Statuses" : filter}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1350px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <SortableHeader
                  label="Case #"
                  sortKeyValue="caseNumber"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Client"
                  sortKeyValue="clientName"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Status"
                  sortKeyValue="status"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Priority"
                  sortKeyValue="casePriority"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Case Manager"
                  sortKeyValue="assignedCaseManager"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Field Staff"
                  sortKeyValue="assignedFieldStaff"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Travel"
                  sortKeyValue="travelBooked"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Destination"
                  sortKeyValue="destination"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <SortableHeader
                  label="Pickup Date"
                  sortKeyValue="pickupDate"
                  activeSortKey={sortKey}
                  direction={sortDirection}
                  onSort={handleSort}
                />

                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedCases.map((item) => (
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

                  <td className="px-6 py-5">
                    <PriorityBadge priority={item.casePriority || "Standard"} />
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {item.assignedCaseManager || "Unassigned"}
                  </td>

                  <td className="px-6 py-5 text-slate-700">
                    {item.assignedFieldStaff || "Unassigned"}
                  </td>

                  <td className="px-6 py-5">
                    <TravelBadge isBooked={Boolean(item.travelBooked)} />
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

          {!isLoading && filteredAndSortedCases.length === 0 && (
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

function SortableHeader({
  label,
  sortKeyValue,
  activeSortKey,
  direction,
  onSort,
}: {
  label: string;
  sortKeyValue: SortKey;
  activeSortKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  const isActive = activeSortKey === sortKeyValue;

  return (
    <th className="px-6 py-4">
      <button
        type="button"
        onClick={() => onSort(sortKeyValue)}
        className="flex items-center gap-2 text-left font-bold uppercase text-slate-600 hover:text-blue-600"
      >
        <span>{label}</span>
        <span className="text-xs">
          {isActive ? (direction === "asc" ? "▲" : "▼") : "↕"}
        </span>
      </button>
    </th>
  );
}

function getSortValue(item: ApiCase, key: SortKey): string | number {
  if (key === "pickupDate") {
    const date = new Date(item.pickupDate);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
  }

  if (key === "travelBooked") {
    return item.travelBooked ? 1 : 0;
  }

  if (key === "casePriority") {
    const priorityRank: Record<string, number> = {
      Urgent: 3,
      High: 2,
      Standard: 1,
    };

    return priorityRank[item.casePriority || "Standard"] || 0;
  }

  const value = item[key];

  if (typeof value === "string") {
    return value.toLowerCase();
  }

  return "";
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
      className={`rounded-lg px-3 py-1 text-sm font-bold ${
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
      className={`rounded-lg px-3 py-1 text-sm font-bold ${
        styles[priority] || "bg-slate-100 text-slate-700"
      }`}
    >
      {priority}
    </span>
  );
}

function TravelBadge({ isBooked }: { isBooked: boolean }) {
  return (
    <span
      className={`rounded-lg px-3 py-1 text-sm font-bold ${
        isBooked ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
      }`}
    >
      {isBooked ? "Booked" : "Pending"}
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