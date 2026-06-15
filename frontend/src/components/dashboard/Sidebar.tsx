import { NavLink } from "react-router-dom";

import GuardianLogo from "../../assets/logos/Guardian-Ops-Logo.png";

import HomeIcon from "../../assets/icons/Home-Icon-White.svg";
import CasesIcon from "../../assets/icons/Cases-Icon-White.svg";
import IntakeIcon from "../../assets/icons/Intake-Icon-White.svg";
import QuotesIcon from "../../assets/icons/Quotes-Icon-White.svg";
import ExpensesIcon from "../../assets/icons/Expenses-Icon-White.svg";
import SchedulingIcon from "../../assets/icons/Scheduling-Icon-White.svg";
import FieldStaffIcon from "../../assets/icons/Fieldstaff-icon-white.svg";
import NotificationsIcon from "../../assets/icons/Notifications-Icon-White.svg";
import ReportsIcon from "../../assets/icons/Reports-Icon-White.svg";
import ClientDirectoryIcon from "../../assets/icons/Client-Directory-White.svg";
import SettingsIcon from "../../assets/icons/Settings-Icon-White.svg";
import SupportIcon from "../../assets/icons/Support-Icon-White.svg";

type MenuItem = {
  title: string;
  icon: string;
  path: string;
  badge?: string;
  allowedRoles: string[];
};

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: HomeIcon,
    path: "/dashboard",
    allowedRoles: ["Admin", "Employee", "Case Manager", "Field Staff", "Parent", "Client"],
  },
  {
    title: "Cases",
    icon: CasesIcon,
    path: "/cases",
    allowedRoles: ["Admin", "Employee", "Case Manager", "Field Staff"],
  },
  {
    title: "Intake Forms",
    icon: IntakeIcon,
    path: "/intake-forms",
    allowedRoles: ["Admin", "Employee", "Case Manager"],
  },
  {
    title: "Quotes",
    icon: QuotesIcon,
    path: "/quotes",
    allowedRoles: ["Admin", "Employee", "Case Manager"],
  },
  {
    title: "Expenses",
    icon: ExpensesIcon,
    path: "/expenses",
    allowedRoles: ["Admin", "Employee", "Case Manager"],
  },
  {
    title: "Scheduling",
    icon: SchedulingIcon,
    path: "/scheduling",
    allowedRoles: ["Admin", "Employee", "Case Manager", "Field Staff"],
  },
  {
    title: "Field Staff",
    icon: FieldStaffIcon,
    path: "/field-staff",
    allowedRoles: ["Admin", "Employee", "Case Manager"],
  },
  {
    title: "Notifications",
    icon: NotificationsIcon,
    path: "/notifications",
    badge: "12",
    allowedRoles: ["Admin", "Employee", "Case Manager", "Field Staff", "Parent", "Client"],
  },
  {
    title: "Reports",
    icon: ReportsIcon,
    path: "/reports",
    allowedRoles: ["Admin", "Case Manager", "Client"],
  },
  {
    title: "Client Directory",
    icon: ClientDirectoryIcon,
    path: "/clients",
    allowedRoles: ["Admin", "Case Manager", "Client"],
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    path: "/settings",
    allowedRoles: ["Admin"],
  },
  {
    title: "Support",
    icon: SupportIcon,
    path: "/support",
    allowedRoles: ["Admin", "Employee", "Case Manager", "Field Staff", "Parent", "Client"],
  },
];

function Sidebar() {
 const storedUser = localStorage.getItem("guardianops-user");

let user: { name?: string; role?: string } | null = null;

try {
  user = storedUser ? JSON.parse(storedUser) : null;
} catch {
  user = null;
}
  const userRole = user?.role || "";

  const visibleMenuItems = menuItems.filter((item) =>
    item.allowedRoles.includes(userRole)
  );

  const initials =
    user?.name
      ?.split(" ")
      .map((part: string) => part[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <aside
      className="hidden min-h-screen w-[300px] flex-col text-white xl:flex"
      style={{ backgroundColor: "#001333" }}
    >
      <div className="flex justify-center px-6 pt-8 pb-8">
        <img src={GuardianLogo} alt="GuardianOps" className="w-[220px]" />
      </div>

      <nav className="flex-1 px-5">
        <div className="space-y-3">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex w-full items-center rounded-xl px-5 py-3 transition-all ${
                  isActive
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-200 hover:bg-[#002766] hover:text-white"
                }`
              }
            >
              <div className="flex min-w-0 flex-1 items-center gap-5">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-6 w-6 shrink-0 object-contain"
                />

                <span className="truncate text-lg font-semibold">
                  {item.title}
                </span>
              </div>

              {item.badge && (
                <span className="ml-3 flex h-7 min-w-[32px] shrink-0 items-center justify-center rounded-full bg-white px-2 text-sm font-bold text-blue-600">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="mx-12 border-t border-[#5E6C89]" />

      <div className="px-8 py-7">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-900">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-white">
              {user?.name || "User"}
            </p>

            <p className="truncate text-sm text-[#A6B4D0]">
              {user?.role || "Authenticated User"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;