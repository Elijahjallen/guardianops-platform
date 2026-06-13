import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../../store/notificationStore";

import CasesIconBlue from "../../assets/icons/Cases-Icon-Blue.svg";
import ExpensesReportIconGreen from "../../assets/icons/Expenses-Report-Icon-Green.svg";
import DelayIcon from "../../assets/icons/Delay-Icon.svg";
import QuoteApprovedIcon from "../../assets/icons/Quote-Approved-Icon.svg";

function RecentAlerts() {
  const navigate = useNavigate();
  const notifications = useNotificationStore((state) => state.notifications);
  const recentNotifications = notifications.slice(0, 5);

  return (
    <section className="rounded-xl border border-slate-300 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-300 px-6 py-5">
        <h2 className="text-xl font-bold text-slate-950">Recent Alerts</h2>

        <button
          onClick={() => navigate("/notifications")}
          className="text-sm font-medium text-slate-950 hover:text-blue-600"
        >
          View All
        </button>
      </div>

      <div className="px-6 py-4">
        {recentNotifications.map((alert, index) => (
          <div
            key={alert.id}
            className={`flex items-center gap-4 py-5 ${
              index !== recentNotifications.length - 1
                ? "border-b border-slate-200"
                : ""
            }`}
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${getAlertBackground(
                alert.type
              )}`}
            >
              <img
                src={getAlertIcon(alert.type)}
                alt={alert.title}
                className="h-7 w-7 object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {alert.title}
              </p>

              <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
            </div>

            <div className="flex w-[70px] shrink-0 flex-col items-end gap-3">
              <span className="text-xs text-slate-500">{alert.timestamp}</span>

              <span className="h-2 w-2 rounded-full bg-blue-600" />
            </div>
          </div>
        ))}

        {recentNotifications.length === 0 && (
          <p className="py-6 text-center text-sm font-semibold text-slate-500">
            No recent alerts.
          </p>
        )}
      </div>
    </section>
  );
}

function getAlertIcon(type: string) {
  switch (type) {
    case "success":
      return QuoteApprovedIcon;
    case "warning":
      return DelayIcon;
    case "danger":
      return ExpensesReportIconGreen;
    case "info":
    default:
      return CasesIconBlue;
  }
}

function getAlertBackground(type: string) {
  switch (type) {
    case "success":
      return "bg-green-50";
    case "warning":
      return "bg-orange-50";
    case "danger":
      return "bg-red-50";
    case "info":
    default:
      return "bg-blue-50";
  }
}

export default RecentAlerts;