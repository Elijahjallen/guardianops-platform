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
  updateStaff: (staffId: string, updatedStaff: Partial<StaffMember>) => void;
};

export const useStaffStore = create<StaffStore>()(
  persist(
    (set) => ({
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
          dateOfBirth: "03/14/1986",
          driversLicense: "ID-DL-482913",
          passport: "Valid - Expires 08/2030",
          homeAirport: "BOI - Boise Airport",
          certifications: [
            "CPR/First Aid",
            "Crisis Intervention",
            "Defensive Driving",
          ],
          degrees: ["B.S. Criminal Justice"],
          dateOfHire: "01/15/2023",
          homeAddress: "1234 North Maple Ave, Boise, ID 83704",
          emergencyContact: "Amanda Brown - (208) 555-0912",
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
          dateOfBirth: "07/22/1990",
          driversLicense: "ID-DL-673901",
          passport: "Valid - Expires 05/2029",
          homeAirport: "BOI - Boise Airport",
          certifications: ["CPR/First Aid", "Youth Transport Safety"],
          degrees: ["B.A. Psychology"],
          dateOfHire: "04/03/2024",
          homeAddress: "884 West River Street, Meridian, ID 83642",
          emergencyContact: "Mark Johnson - (208) 555-0221",
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
          dateOfBirth: "11/09/1982",
          driversLicense: "WA-DL-338210",
          passport: "Valid - Expires 12/2028",
          homeAirport: "SEA - Seattle-Tacoma International",
          certifications: [
            "Crisis Intervention",
            "Case Management",
            "Defensive Driving",
          ],
          degrees: [
            "B.S. Business Administration",
            "M.S. Organizational Leadership",
          ],
          dateOfHire: "09/18/2022",
          homeAddress: "4567 Pine Ridge Lane, Seattle, WA 98101",
          emergencyContact: "Lisa Wilson - (206) 555-0177",
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
          dateOfBirth: "02/03/1988",
          driversLicense: "AZ-DL-771204",
          passport: "Valid - Expires 03/2031",
          homeAirport: "PHX - Phoenix Sky Harbor",
          certifications: [
            "CPR/First Aid",
            "Leadership Training",
            "Incident Response",
          ],
          degrees: ["B.A. Social Work"],
          dateOfHire: "06/10/2021",
          homeAddress: "902 Desert View Road, Phoenix, AZ 85004",
          emergencyContact: "Chris Lee - (602) 555-0884",
        },
      ],

      updateStaff: (staffId, updatedStaff) =>
        set((state) => ({
          staff: state.staff.map((member) =>
            member.id === staffId ? { ...member, ...updatedStaff } : member
          ),
        })),
    }),
    {
      name: "guardianops-staff-store",
    }
  )
);