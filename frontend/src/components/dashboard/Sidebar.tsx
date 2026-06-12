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

const menuItems = [
  {
    title: "Dashboard",
    icon: HomeIcon,
    active: true,
  },
  {
    title: "Cases",
    icon: CasesIcon,
  },
  {
    title: "Intake Forms",
    icon: IntakeIcon,
  },
  {
    title: "Quotes",
    icon: QuotesIcon,
  },
  {
    title: "Expenses",
    icon: ExpensesIcon,
  },
  {
    title: "Scheduling",
    icon: SchedulingIcon,
  },
  {
    title: "Field Staff",
    icon: FieldStaffIcon,
  },
  {
    title: "Notifications",
    icon: NotificationsIcon,
    badge: "12",
  },
  {
    title: "Reports",
    icon: ReportsIcon,
  },
  {
    title: "Client Directory",
    icon: ClientDirectoryIcon,
  },
  {
    title: "Settings",
    icon: SettingsIcon,
  },
  {
    title: "Support",
    icon: SupportIcon,
  },
];

function Sidebar() {
  return (
    <aside
      className="hidden min-h-screen w-[300px] flex-col text-white xl:flex"
      style={{ backgroundColor: "#001333" }}
    >
      {/* Logo Area */}
      <div className="flex justify-center px-6 pt-8 pb-8">
        <img
          src={GuardianLogo}
          alt="GuardianOps"
          className="w-[220px]"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-5">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <button
              key={item.title}
              className={`flex w-full items-center rounded-xl px-5 py-3 transition-all ${
                item.active
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-200 hover:bg-[#002766] hover:text-white"
              }`}
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
            </button>
          ))}
        </div>
      </nav>

      {/* Divider */}
      <div className="mx-12 border-t border-[#5E6C89]" />

      {/* User Profile */}
      <div className="px-8 py-7">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-900">
            JS
          </div>

          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-white">
              John Smith
            </p>

            <p className="truncate text-sm text-[#A6B4D0]">
              Transport Coordinator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;