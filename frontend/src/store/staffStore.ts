import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  dateOfBirth: string;
  driversLicense: string;
  passport: string;
  homeAirport: string;
  certifications: string[];
  degrees: string[];
  dateOfHire: string;
  homeAddress: string;
  emergencyContact: string;
};

type StaffStore = {
  staff: StaffMember[];
  addStaff: (newStaff: StaffMember) => void;
  updateStaff: (staffId: string, updatedStaff: Partial<StaffMember>) => void;
  deleteStaff: (staffId: string) => void;
};

export const useStaffStore = create<StaffStore>()(
  persist(
    (set) => ({
      staff: [],

      addStaff: (newStaff) =>
        set((state) => ({
          staff: [newStaff, ...state.staff],
        })),

      updateStaff: (staffId, updatedStaff) =>
        set((state) => ({
          staff: state.staff.map((member) =>
            member.id === staffId ? { ...member, ...updatedStaff } : member
          ),
        })),

      deleteStaff: (staffId) =>
        set((state) => ({
          staff: state.staff.filter((member) => member.id !== staffId),
        })),
    }),
    {
      name: "guardianops-staff-store",
    }
  )
);