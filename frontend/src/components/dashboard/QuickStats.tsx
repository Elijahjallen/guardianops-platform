import { useEffect, useState } from "react";

import { getDashboardStats } from "../../services/api";

import CasesIcon from "../../assets/icons/Cases-Icon.svg";
import PendingQuotesIcon from "../../assets/icons/Pending-Quotes-Icon.svg";
import FieldStaffIcon from "../../assets/icons/Field-Staff-Icon-Purple.svg";
import OpenNotificationsIcon from "../../assets/icons/Open-Notifications-Icon.svg";

type DashboardStats = {
  totalCases: number;
  pendingCases: number;
  activeStaff: number;
  upcomingPickups: number;

  pendingQuotes: number;
  sentQuotes: number;
  approvedQuotes: number;
  revenuePipeline: number;
  approvedRevenue: number;

  totalRevenue: number;
  totalExpenses: number;
  projectedProfit: number;
  averageCaseValue: number;
};

function QuickStats() {
  const [statsData, setStatsData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const data = await getDashboardStats();
        setStatsData(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      }
    }

    loadDashboardData();
  }, []);

  const stats = [
    {
      title: "Total Cases",
      value: statsData?.totalCases ?? 0,
      subtitle: `${statsData?.pendingCases ?? 0} pending review`,
      icon: CasesIcon,
      iconBackground: "bg-blue-50",
    },
    {
      title: "Revenue Pipeline",
      value: formatCurrency(statsData?.revenuePipeline ?? 0),
      subtitle: "Sent + approved quotes",
      icon: PendingQuotesIcon,
      iconBackground: "bg-blue-50",
    },
    {
      title: "Approved Revenue",
      value: formatCurrency(statsData?.approvedRevenue ?? 0),
      subtitle: `${statsData?.approvedQuotes ?? 0} approved quotes`,
      icon: CasesIcon,
      iconBackground: "bg-green-50",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(statsData?.totalRevenue ?? 0),
      subtitle: "All quoted case value",
      icon: PendingQuotesIcon,
      iconBackground: "bg-green-50",
    },
    {
      title: "Total Expenses",
      value: formatCurrency(statsData?.totalExpenses ?? 0),
      subtitle: "Tracked case expenses",
      icon: OpenNotificationsIcon,
      iconBackground: "bg-orange-50",
    },
    {
      title: "Projected Profit",
      value: formatCurrency(statsData?.projectedProfit ?? 0),
      subtitle: "Revenue minus expenses",
      icon: CasesIcon,
      iconBackground: "bg-purple-50",
    },
    {
      title: "Average Case Value",
      value: formatCurrency(statsData?.averageCaseValue ?? 0),
      subtitle: "Average quote amount",
      icon: PendingQuotesIcon,
      iconBackground: "bg-blue-50",
    },
    {
      title: "Sent Quotes",
      value: statsData?.sentQuotes ?? 0,
      subtitle: `${statsData?.pendingQuotes ?? 0} pending quotes`,
      icon: PendingQuotesIcon,
      iconBackground: "bg-orange-50",
    },
    {
      title: "Active Staff",
      value: statsData?.activeStaff ?? 0,
      subtitle: "Available or en route",
      icon: FieldStaffIcon,
      iconBackground: "bg-purple-50",
    },
    {
      title: "Upcoming Pickups",
      value: statsData?.upcomingPickups ?? 0,
      subtitle: "Scheduled from today forward",
      icon: OpenNotificationsIcon,
      iconBackground: "bg-green-50",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex min-h-[135px] items-center gap-5 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm"
        >
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.iconBackground}`}
          >
            <img
              src={stat.icon}
              alt={stat.title}
              className="h-8 w-8 object-contain"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              {stat.title}
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-950">
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

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default QuickStats;