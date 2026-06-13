import DashboardLayout from "../components/dashboard/DashboardLayout";
import { useNotificationStore } from "../store/notificationStore";

function NotificationsPage() {
  const notifications = useNotificationStore((state) => state.notifications);
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications
  );

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">Notifications</h1>
          <p className="mt-2 text-slate-500">
            View case activity, alerts, and operational updates.
          </p>
        </div>

        <button
          onClick={clearNotifications}
          className="rounded-xl border border-slate-300 px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
        >
          Clear All
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-950">All Alerts</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex gap-4 p-6">
              <span className="mt-2 h-3 w-3 rounded-full bg-blue-600" />

              <div>
                <p className="text-lg font-bold text-slate-950">
                  {notification.title}
                </p>

                <p className="mt-1 text-slate-600">{notification.message}</p>

                <p className="mt-2 text-sm font-semibold text-slate-400">
                  {notification.timestamp}
                </p>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="p-8 text-center font-semibold text-slate-500">
              No notifications found.
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}

export default NotificationsPage;