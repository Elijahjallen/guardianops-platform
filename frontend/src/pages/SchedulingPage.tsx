import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import { getCases } from "../services/api";

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  assignedCaseManager?: string | null;
  assignedFieldStaff?: string | null;
  travelBooked?: boolean;
  casePriority?: string;

  scheduledPickupTime?: string | null;
  scheduledDropoffTime?: string | null;
  departureAirport?: string | null;
  arrivalAirport?: string | null;
  assignedEscortId?: string | null;
  schedulingStatus?: string | null;
};

function SchedulingPage() {
  const navigate = useNavigate();

  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("All");

  async function loadCases() {
    try {
      setIsLoading(true);
      const data = await getCases();
      setCases(data);
    } catch (error) {
      console.error("Failed to load scheduling data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCases();
  }, []);

  const unscheduledCases = cases.filter(
    (item) =>
      !item.schedulingStatus ||
      item.schedulingStatus === "Not Scheduled" ||
      item.schedulingStatus === "Scheduling Pending"
  );

  const scheduledCases = cases.filter(
    (item) =>
      item.schedulingStatus === "Scheduled" ||
      item.schedulingStatus === "Travel Booked" ||
      item.schedulingStatus === "In Progress"
  );

  const travelBookedCases = cases.filter((item) => item.travelBooked);

  const upcomingPickups = cases.filter((item) => {
    if (!item.scheduledPickupTime && !item.pickupDate) return false;

    const date = new Date(item.scheduledPickupTime || item.pickupDate);

    return !Number.isNaN(date.getTime()) && date >= new Date();
  });

  const filteredCases = useMemo(() => {
    if (selectedFilter === "All") return cases;

    return cases.filter(
      (item) => (item.schedulingStatus || "Not Scheduled") === selectedFilter
    );
  }, [cases, selectedFilter]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Scheduling</h1>

          <p className="mt-2 text-slate-500">
            Manage case scheduling, airport routing, assigned escorts, pickup
            windows, and travel readiness.
          </p>
        </div>

        <button
          onClick={() => navigate("/cases")}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          + Schedule Transport
        </button>
      </div>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ScheduleCard
          title="Unscheduled"
          value={unscheduledCases.length.toString()}
          subtitle="Needs scheduling review"
        />

        <ScheduleCard
          title="Scheduled"
          value={scheduledCases.length.toString()}
          subtitle="Pickup or travel planned"
        />

        <ScheduleCard
          title="Travel Booked"
          value={travelBookedCases.length.toString()}
          subtitle="Flights or lodging confirmed"
        />

        <ScheduleCard
          title="Upcoming Pickups"
          value={upcomingPickups.length.toString()}
          subtitle="Scheduled from today forward"
        />
      </section>

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Transport Schedule
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Live scheduling data pulled from PostgreSQL case records.
            </p>
          </div>

          <select
            value={selectedFilter}
            onChange={(event) => setSelectedFilter(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 xl:w-[260px]"
          >
            <option value="All">All Scheduling Statuses</option>
            <option value="Not Scheduled">Not Scheduled</option>
            <option value="Scheduling Pending">Scheduling Pending</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Travel Booked">Travel Booked</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Case</th>
                <th className="px-6 py-4">Scheduling</th>
                <th className="px-6 py-4">Pickup Window</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Assignment</th>
                <th className="px-6 py-4">Travel</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    Loading scheduling data...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center">
                    No scheduled transports found.
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
                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        {item.clientName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.destination}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <SchedulingBadge
                        status={item.schedulingStatus || "Not Scheduled"}
                      />
                      <p className="mt-2 text-sm text-slate-500">
                        Case: {item.status}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <p className="font-semibold text-slate-800">
                        Pickup:{" "}
                        {formatDateTime(
                          item.scheduledPickupTime || item.pickupDate
                        )}
                      </p>
                      <p className="mt-2 text-sm text-slate-500">
                        Dropoff: {formatDateTime(item.scheduledDropoffTime)}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <p className="font-semibold text-slate-800">
                        {item.departureAirport || "Departure TBD"}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        to {item.arrivalAirport || "Arrival TBD"}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <p className="text-sm text-slate-500">Escort</p>
                      <p className="font-semibold text-slate-800">
                        {item.assignedEscortId || "Unassigned"}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">Field Staff</p>
                      <p className="font-semibold text-slate-800">
                        {item.assignedFieldStaff || "Unassigned"}
                      </p>
                    </td>

                    <td className="px-6 py-5 align-top">
                      <TravelBadge isBooked={item.travelBooked} />
                    </td>

                    <td className="px-6 py-5 text-right align-top">
                      <button
                        onClick={() => navigate(`/cases/${item.id}`)}
                        className="rounded-xl border border-blue-600 px-4 py-2 font-bold text-blue-600 hover:bg-blue-50"
                      >
                        View Case
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

function ScheduleCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-400">{subtitle}</p>
    </div>
  );
}

function SchedulingBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Not Scheduled": "bg-slate-100 text-slate-700",
    "Scheduling Pending": "bg-amber-100 text-amber-700",
    Scheduled: "bg-purple-100 text-purple-700",
    "Travel Booked": "bg-green-100 text-green-700",
    "In Progress": "bg-sky-100 text-sky-700",
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

function formatDateTime(dateValue?: string | null) {
  if (!dateValue) {
    return "Not scheduled";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default SchedulingPage;