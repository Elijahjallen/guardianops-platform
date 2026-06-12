function TopNav() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-950">
          Operations Dashboard
        </h2>
        <p className="text-sm text-slate-500">
          Monitor active transports, staff activity, and case performance.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700">
          Notifications
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
          EA
        </div>
      </div>
    </header>
  );
}

export default TopNav;