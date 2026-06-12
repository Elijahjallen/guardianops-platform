import { useCaseStore } from "../../store/caseStore";
import { useStaffStore } from "../../store/staffStore";

import CasesIcon from "../../assets/icons/Cases-Icon.svg";
import PendingQuotesIcon from "../../assets/icons/Pending-Quotes-Icon.svg";
import FieldStaffIcon from "../../assets/icons/Field-Staff-Icon-Purple.svg";
import OpenNotificationsIcon from "../../assets/icons/Open-Notifications-Icon.svg";

import UpArrowIcon from "../../assets/icons/Up-Arrow-Icon.svg";
import DownArrowIcon from "../../assets/icons/Down-Arrow-Notifications.svg";

function QuickStats() {
  const cases = useCaseStore((state) => state.cases);
  const staff = useStaffStore((state) => state.staff);

  const activeCases = cases.length;
  const pendingCases = cases.filter((item) => item.status === "Pending").length;
  const activeStaff = staff.filter(
    (member) => member.status === "Available" || member.status === "En Route"
  ).length;

  const stats = [
    {
      title: "Active Cases",
      value: activeCases.toString(),
      change: "2",
      direction: "up",
      icon: CasesIcon,
      iconBackground: "bg-blue-50",
    },
    {
      title: "Pending Quotes",
      value: pendingCases.toString(),
      change: "5",
      direction: "up",
      icon: PendingQuotesIcon,
      iconBackground: "bg-green-50",
    },
    {
      title: "Field Staff Active",
      value: activeStaff.toString(),
      change: "5",
      direction: "up",
      icon: FieldStaffIcon,
      iconBackground: "bg-purple-50",
    },
    {
      title: "Open Notifications",
      value: "21",
      change: "5",
      direction: "down",
      icon: OpenNotificationsIcon,
      iconBackground: "bg-orange-50",
    },
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="flex min-h-[135px] items-center gap-6 rounded-xl border border-slate-300 bg-white px-8 py-6 shadow-sm"
        >
          <div
            className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-lg ${stat.iconBackground}`}
          >
            <img
              src={stat.icon}
              alt={stat.title}
              className="h-12 w-12 object-contain"
            />
          </div>

          <div>
            <p className="text-lg font-semibold text-slate-950">
              {stat.title}
            </p>

            <p className="mt-2 text-4xl font-semibold text-slate-950">
              {stat.value}
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <img
                src={stat.direction === "up" ? UpArrowIcon : DownArrowIcon}
                alt={stat.direction}
                className="h-4 w-4"
              />

              <span
                className={`font-bold ${
                  stat.direction === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>

              <span className="text-slate-950">from yesterday</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default QuickStats;