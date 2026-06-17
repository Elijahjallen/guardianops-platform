import { useEffect, useState } from "react";

import { getCases, getStaff } from "../../services/api";

import CasesIcon from "../../assets/icons/Cases-Icon.svg";
import PendingQuotesIcon from "../../assets/icons/Pending-Quotes-Icon.svg";
import FieldStaffIcon from "../../assets/icons/Field-Staff-Icon-Purple.svg";
import OpenNotificationsIcon from "../../assets/icons/Open-Notifications-Icon.svg";

type ApiCase = {
  id: string;
  status: string;
  travelBooked?: boolean;
  casePriority?: string;
};

type ApiStaffMember = {
  id: string;
  role: string;
  status: string;
};

function QuickStats() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [staff, setStaff] = useState<ApiStaffMember[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [caseData, staffData] = await Promise.all([
          getCases(),
          getStaff(),
        ]);

        setCases(caseData);
        setStaff(staffData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    }

    loadDashboardData();
  }, []);

  const activeCases = cases.filter(
    (item) => item.status !== "Completed" && item.status !== "Cancelled"
  ).length;

  const urgentCases = cases.filter(
    (item) => item.casePriority === "Urgent"
  ).length;

  const travelPending = cases.filter(
    (item) =>
      item.status !== "Completed" &&
      item.status !== "Cancelled" &&
      !item.travelBooked
  ).length;

  const availableStaff = staff.filter(
    (member) => member.status === "Available"
  ).length;

  const stats = [
    {
      title: "Active Cases",
      value: activeCases,
      subtitle: `${cases.length} total cases`,
      icon: CasesIcon,
      iconBackground: "bg-blue-50",
    },
    {
      title: "Urgent Cases",
      value: urgentCases,
      subtitle: "Require priority review",
      icon: PendingQuotesIcon,
      iconBackground: "bg-red-50",
    },
    {
      title: "Travel Pending",
      value: travelPending,
      subtitle: "Open cases not booked",
      icon: OpenNotificationsIcon,
      iconBackground: "bg-orange-50",
    },
    {
      title: "Available Staff",
      value: availableStaff,
      subtitle: `${staff.length} total employees`,
      icon: FieldStaffIcon,
      iconBackground: "bg-purple-50",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex min-h-[135px] items-center gap-6 rounded-2xl border border-slate-200 bg-white px-7 py-6 shadow-sm"
        >
          <div
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${stat.iconBackground}`}
          >
            <img
              src={stat.icon}
              alt={stat.title}
              className="h-9 w-9 object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
              {stat.title}
            </p>

            <p className="mt-2 text-4xl font-bold text-slate-950">
              {stat.value}
            </p>

            <p className="mt-1 text-sm font-semibold text-slate-500">
              {stat.subtitle}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}

export default QuickStats;