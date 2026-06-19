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
  quoteAmount?: number | null;
  quoteStatus?: string | null;
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

      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setCases(sortedData);
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

  const filteredCases = useMemo(() => {
    const searchValue = searchText.toLowerCase();

    return cases.filter((item) => {
      const matchesSearch =
        item.caseNumber.toLowerCase().includes(searchValue) ||
        item.clientName.toLowerCase().includes(searchValue) ||
        item.destination.toLowerCase().includes(searchValue) ||
        (item.assignedCaseManager || "").toLowerCase().includes(searchValue) ||
        (item.assignedFieldStaff || "").toLowerCase().includes(searchValue) ||
        (item.casePriority || "").toLowerCase().includes(searchValue) ||
        (item.quoteStatus || "").toLowerCase().includes(searchValue);

      const matchesFilter =
        selectedFilter === "All" || item.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });
  }, [cases, searchText, selectedFilter]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Cases</h1>

          <p className="mt-2 text-slate-500">
            Manage case status, quotes, assignments, travel readiness, and
            transport activity.
          </p>
        </div>

        <button
          onClick={() => setIsNewCaseOpen(true)}
          className="w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 xl:w-auto"
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
              placeholder="Search case number, client, destination, staff, quote status..."
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

        <div className="overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Case</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Quote</th>
                <th className="px-6 py-4">Assignment</th>
                <th className="px-6 py-4">Travel</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    Loading cases from database...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center">
                    No cases found.
                  </td>
                </tr>
              ) : (
                filteredCases.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 align-top">
                      <p className="font-bold text-slate-950">
                        {item.caseNumber}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-600">
                        {item.clientName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Created {formatDate(item.createdAt)}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <StatusBadge status={item.status} />
                      <div className="mt-2">
                        <PriorityBadge
                          priority={item.casePriority || "Standard"}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <p className="font-bold text-slate-950">
                        {formatCurrency(item.quoteAmount)}
                      </p>
                      <div className="mt-2">
                        <QuoteStatusBadge
                          status={item.quoteStatus || "Pending"}
                        />
                      </div>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <p className="text-sm text-slate-500">Manager</p>
                      <p className="font-semibold text-slate-800">
                        {item.assignedCaseManager || "Unassigned"}
                      </p>

                      <p className="mt-3 text-sm text-slate-500">
                        Field Staff
                      </p>
                      <p className="font-semibold text-slate-800">
                        {item.assignedFieldStaff || "Unassigned"}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <p className="font-semibold text-slate-800">
                        {item.destination}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Pickup {formatDate(item.pickupDate)}
                      </p>
                      <div className="mt-2">
                        <TravelBadge isBooked={item.travelBooked} />
                      </div>
                    </td>

                    <td className="px-6 py-5 text-right align-top">
                      <button
                        onClick={() => navigate(`/cases/${item.id}`)}
                        className="rounded-xl border border-blue-600 px-4 py-2 font-bold text-blue-600 hover:bg-blue-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
      className={`inline-flex rounded-lg px-3 py-1 text-sm font-bold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function QuoteStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-gray-100 text-gray-700",
    Drafted: "bg-blue-100 text-blue-700",
    Sent: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Declined: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1 text-sm font-bold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Low: "bg-slate-100 text-slate-700",
    Standard: "bg-blue-100 text-blue-700",
    Medium: "bg-yellow-100 text-yellow-700",
    High: "bg-orange-100 text-orange-700",
    Urgent: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1 text-sm font-bold ${
        styles[priority] || "bg-blue-100 text-blue-700"
      }`}
    >
      {priority}
    </span>
  );
}

function TravelBadge({ isBooked }: { isBooked?: boolean }) {
  return (
    <span
      className={`inline-flex rounded-lg px-3 py-1 text-sm font-bold ${
        isBooked ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
      }`}
    >
      {isBooked ? "Booked" : "Not Booked"}
    </span>
  );
}

function formatDate(dateValue?: string | null) {
  if (!dateValue) {
    return "Not scheduled";
  }

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

function formatCurrency(amount?: number | null) {
  if (amount === null || amount === undefined) {
    return "—";
  }

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default CasesPage;