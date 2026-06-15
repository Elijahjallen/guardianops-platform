import { useEffect, useState } from "react";

import { getNotifications } from "../../services/api";

type ApiNotification = {
  id: string;
  title: string;
  message: string;
  severity: string;
  createdAt: string;
};

function RecentAlerts() {
  const [alerts, setAlerts] = useState<ApiNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await getNotifications();
        setAlerts(data.slice(0, 5));
      } catch (error) {
        console.error("Failed to load recent alerts:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadAlerts();
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">
            Recent Alerts
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Latest database-backed notifications.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="py-8 text-center font-semibold text-slate-500">
          Loading alerts...
        </div>
      )}

      {!isLoading && alerts.length === 0 && (
        <div className="py-8 text-center font-semibold text-slate-500">
          No recent alerts.
        </div>
      )}

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <h3 className="font-bold text-slate-950">{alert.title}</h3>

              <SeverityBadge severity={alert.severity} />
            </div>

            <p className="text-sm text-slate-600">{alert.message}</p>

            <p className="mt-3 text-xs font-semibold text-slate-400">
              {formatDate(alert.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-orange-100 text-orange-700",
    Low: "bg-green-100 text-green-700",
    Info: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1 text-xs font-bold ${
        styles[severity] || "bg-slate-100 text-slate-700"
      }`}
    >
      {severity}
    </span>
  );
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default RecentAlerts;