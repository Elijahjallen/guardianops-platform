import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CaseStatus =
  | "En Route"
  | "Scheduled"
  | "Pending"
  | "In Progress"
  | "Completed"
  | "Cancelled";

export type TransportCase = {
  id: string;
  client: string;
  status: CaseStatus;
  staff: string;
  destination: string;
  pickupLocation: string;
  pickupDate: string;
  priority: string;
  notes: string;
  lastUpdate: string;
};

type CaseStore = {
  cases: TransportCase[];
  addCase: (newCase: TransportCase) => void;
  updateCase: (caseId: string, updatedCase: Partial<TransportCase>) => void;
  deleteCase: (caseId: string) => void;
  getCaseById: (caseId: string) => TransportCase | undefined;
};

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      cases: [
        {
          id: "2026-0014",
          client: "Orange County Schools",
          status: "En Route",
          staff: "Michael Brown",
          destination: "Dallas, TX",
          pickupLocation: "Boise, ID",
          pickupDate: "May 20, 2026",
          priority: "High",
          notes: "Transport currently en route.",
          lastUpdate: "2 min ago",
        },
        {
          id: "2026-0013",
          client: "Safe Harbor Agency",
          status: "Scheduled",
          staff: "Sarah Johnson",
          destination: "Boise, ID",
          pickupLocation: "Phoenix, AZ",
          pickupDate: "May 20, 2026",
          priority: "Normal",
          notes: "Scheduled for pickup.",
          lastUpdate: "2 min ago",
        },
      ],

      addCase: (newCase) =>
        set((state) => ({
          cases: [newCase, ...state.cases],
        })),

      updateCase: (caseId, updatedCase) =>
        set((state) => ({
          cases: state.cases.map((caseItem) =>
            caseItem.id === caseId
              ? {
                  ...caseItem,
                  ...updatedCase,
                  lastUpdate: "Just now",
                }
              : caseItem
          ),
        })),

      deleteCase: (caseId) =>
        set((state) => ({
          cases: state.cases.filter((caseItem) => caseItem.id !== caseId),
        })),

      getCaseById: (caseId) =>
        get().cases.find((caseItem) => caseItem.id === caseId),
    }),
    {
      name: "guardianops-case-store",
    }
  )
);