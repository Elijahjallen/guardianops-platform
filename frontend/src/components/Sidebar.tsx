const navItems = [
  "Dashboard",
  "Cases",
  "Intake Forms",
  "Quotes",
  "Expenses",
  "Scheduling",
  "Reports",
  "Settings",
];

function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 bg-slate-950 px-6 py-8 text-white lg:block">
      <h1 className="text-2xl font-extrabold">
        Guardian<span className="text-amber-400">Ops</span>
      </h1>

      <nav className="mt-10 space-y-2">
        {navItems.map((item) => (
          <button
            key={item}
            className="w-full rounded-xl px-4 py-3 text-left font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            {item}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;