import { create } from "zustand";

export type StaffStatus = "Available" | "En Route" | "Busy" | "Off Duty";

export type StaffMember = {
  id: string;
  name: string;
  role: string;
  status: StaffStatus;
  activeCases: number;
  location: string;
  phone: string;
  email: string;
};

type StaffStore = {
  staff: StaffMember[];
};

export const useStaffStore = create<StaffStore>(() => ({
  staff: [
    {
      id: "STF-001",
      name: "Michael Brown",
      role: "Transport Specialist",
      status: "En Route",
      activeCases: 2,
      location: "Dallas, TX",
      phone: "(208) 555-0182",
      email: "michael.brown@guardianops.com",
    },
    {
      id: "STF-002",
      name: "Sarah Johnson",
      role: "Case Escort",
      status: "Available",
      activeCases: 1,
      location: "Boise, ID",
      phone: "(208) 555-0144",
      email: "sarah.johnson@guardianops.com",
    },
    {
      id: "STF-003",
      name: "David Wilson",
      role: "Transport Coordinator",
      status: "Busy",
      activeCases: 3,
      location: "Seattle, WA",
      phone: "(208) 555-0198",
      email: "david.wilson@guardianops.com",
    },
    {
      id: "STF-004",
      name: "Jennifer Lee",
      role: "Field Supervisor",
      status: "Off Duty",
      activeCases: 0,
      location: "Phoenix, AZ",
      phone: "(208) 555-0167",
      email: "jennifer.lee@guardianops.com",
    },
  ],
}));