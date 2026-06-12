import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../store/authStore";

import MagGlassIcon from "../../assets/icons/Mag-glass-icon.svg";
import NotificationIcon from "../../assets/icons/Notification-icon.svg";
import ProfileIcon from "../../assets/icons/Profile-Icon.svg";
import DropDownArrow from "../../assets/icons/Drop-down-arrow.svg";

function TopNavigation() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="flex h-24 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          Welcome back, John!
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's what's happening with your operations today.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex w-[420px] items-center rounded-xl border border-slate-200 bg-white px-4 py-3">
          <img src={MagGlassIcon} alt="Search" className="mr-3 h-5 w-5" />

          <input
            type="text"
            placeholder="Search cases, clients, staff..."
            className="w-full border-none bg-transparent text-sm outline-none"
          />
        </div>

        <button className="relative">
          <img src={NotificationIcon} alt="Notifications" className="h-6 w-6" />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
        </button>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <img src={ProfileIcon} alt="Profile" className="h-11 w-11" />

          <div className="text-left">
            <p className="font-semibold text-slate-900">John Smith</p>
            <p className="text-xs text-slate-500">Transport Coordinator</p>
          </div>

          <img src={DropDownArrow} alt="Menu" className="h-4 w-4" />
        </div>

        <button
          onClick={handleLogout}
          className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default TopNavigation;