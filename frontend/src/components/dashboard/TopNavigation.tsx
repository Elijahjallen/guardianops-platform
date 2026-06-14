import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AddUserModal from "../auth/AddUserModal";
import ProfileModal from "../auth/ProfileModal";

import MagGlassIcon from "../../assets/icons/Mag-glass-icon.svg";
import NotificationIcon from "../../assets/icons/Notification-icon.svg";
import ProfileIcon from "../../assets/icons/Profile-Icon.svg";
import DropDownArrow from "../../assets/icons/Drop-down-arrow.svg";

function TopNavigation() {
  const navigate = useNavigate();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const storedUser = localStorage.getItem("guardianops-user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  function handleLogout() {
    localStorage.removeItem("guardianops-token");
    localStorage.removeItem("guardianops-user");
    sessionStorage.clear();

    navigate("/", { replace: true });
  }

  return (
    <header className="flex h-24 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-950">
          Welcome back, {user?.name || "User"}!
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

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen((current) => !current)}
            className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-50"
          >
            <img src={ProfileIcon} alt="Profile" className="h-11 w-11" />

            <div className="text-left">
              <p className="font-semibold text-slate-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-slate-500">
                {user?.role || "Authenticated User"}
              </p>
            </div>

            <img
              src={DropDownArrow}
              alt="Menu"
              className={`h-4 w-4 transition ${
                isProfileMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 top-16 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <button
                onClick={() => {
                  setIsProfileOpen(true);
                  setIsProfileMenuOpen(false);
                }}
                className="w-full rounded-xl px-4 py-3 text-left font-semibold text-slate-700 hover:bg-slate-50"
              >
                Profile
              </button>

              {user?.role === "Admin" && (
                <button
                  onClick={() => {
                    setIsAddUserOpen(true);
                    setIsProfileMenuOpen(false);
                  }}
                  className="w-full rounded-xl px-4 py-3 text-left font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Add New User
                </button>
              )}

              <div className="my-2 h-px bg-slate-200" />

              <button
                onClick={handleLogout}
                className="w-full rounded-xl px-4 py-3 text-left font-semibold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
      />
    </header>
  );
}

export default TopNavigation;