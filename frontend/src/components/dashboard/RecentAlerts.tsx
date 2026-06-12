import CasesIconBlue from "../../assets/icons/Cases-Icon-Blue.svg";
import ExpensesReportIconGreen from "../../assets/icons/Expenses-Report-Icon-Green.svg";
import DelayIcon from "../../assets/icons/Delay-Icon.svg";
import QuoteApprovedIcon from "../../assets/icons/Quote-Approved-Icon.svg";
import StaffAlertIconBlue from "../../assets/icons/Staff-Alert-Icon-Blue.svg";

const alerts = [
  {
    title: "Staff update received",
    subtitle: "Case 2026-0001",
    time: "2 min ago",
    icon: CasesIconBlue,
    bgColor: "bg-blue-50",
  },
  {
    title: "Expense Report Submitted",
    subtitle: "Case 2026-0132",
    time: "30 min ago",
    icon: ExpensesReportIconGreen,
    bgColor: "bg-green-50",
  },
  {
    title: "Transport Delay Reported",
    subtitle: "Case 2026-2152",
    time: "1 hr ago",
    icon: DelayIcon,
    bgColor: "bg-orange-50",
  },
  {
    title: "Quote Approved",
    subtitle: "Case 2026-0152",
    time: "2 hr ago",
    icon: QuoteApprovedIcon,
    bgColor: "bg-purple-50",
  },
  {
    title: "New Staff Assigned",
    subtitle: "Case 2026-0139",
    time: "3 hr ago",
    icon: StaffAlertIconBlue,
    bgColor: "bg-blue-50",
  },
];

function RecentAlerts() {
  return (
    <section className="rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-300 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-950">Recent Alerts</h2>

        <button className="text-sm font-medium text-slate-950 hover:text-blue-600">
          View All
        </button>
      </div>

      <div className="px-6 py-4">
        {alerts.map((alert, index) => (
          <div
            key={alert.title}
            className={`flex items-center gap-4 py-5 ${
              index !== alerts.length - 1 ? "border-b border-slate-200" : ""
            }`}
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${alert.bgColor}`}
            >
              <img
                src={alert.icon}
                alt={alert.title}
                className="h-7 w-7 object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {alert.title}
              </p>

              <p className="mt-1 text-sm text-slate-600">
                {alert.subtitle}
              </p>
            </div>

            <div className="flex w-[70px] shrink-0 flex-col items-end gap-3">
              <span className="text-xs text-slate-500">{alert.time}</span>

              <span className="h-2 w-2 rounded-full bg-blue-600" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RecentAlerts;