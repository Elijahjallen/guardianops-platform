import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType = "info" | "success" | "warning" | "danger";

export type GuardianNotification = {
  id: string;
  title: string;
  message: string;
  caseId?: string;
  type: NotificationType;
  timestamp: string;
};

type NotificationStore = {
  notifications: GuardianNotification[];
  addNotification: (
    notification: Omit<GuardianNotification, "id" | "timestamp">
  ) => void;
  clearNotifications: () => void;
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: "NOT-001",
          title: "Staff update received",
          message: "Case 2026-0014",
          caseId: "2026-0014",
          type: "info",
          timestamp: "2 min ago",
        },
        {
          id: "NOT-002",
          title: "Transport delay reported",
          message: "Case 2026-0013",
          caseId: "2026-0013",
          type: "warning",
          timestamp: "30 min ago",
        },
      ],

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `NOT-${Date.now()}`,
              timestamp: "Just now",
            },
            ...state.notifications,
          ],
        })),

      clearNotifications: () =>
        set({
          notifications: [],
        }),
    }),
    {
      name: "guardianops-notification-store",
    }
  )
);