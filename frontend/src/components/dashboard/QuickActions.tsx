import NewCasesIcon from "../../assets/icons/New-Cases-Icon-Blue.svg";
import IntakeIcon from "../../assets/icons/Intake-Icon-Green.svg";
import ScheduleTransportIcon from "../../assets/icons/Schdl-Trnsprt-Purple.svg";
import AddExpenseIcon from "../../assets/icons/Add-Expense-Icon.svg";
import ViewReportsIcon from "../../assets/icons/View-Reports-Icon.svg";
import ClientDirectoryIcon from "../../assets/icons/Client-Directory-Icon.svg";

const actions = [
  { title: "New Case", icon: NewCasesIcon },
  { title: "Intake Form", icon: IntakeIcon },
  { title: "Schedule Transport", icon: ScheduleTransportIcon },
  { title: "Add Expense", icon: AddExpenseIcon },
  { title: "View Reports", icon: ViewReportsIcon },
  { title: "Client Directory", icon: ClientDirectoryIcon },
];

function QuickActions() {
  return (
    <section className="flex h-full flex-col rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-slate-950">Quick Actions</h2>

      <div className="grid flex-1 grid-cols-3 gap-5">
        {actions.map((action) => (
          <button
            key={action.title}
            className="flex h-full min-h-[125px] flex-col items-center justify-center rounded-lg border border-slate-300 bg-white px-3 py-5 transition hover:border-blue-400 hover:bg-slate-50"
          >
            <img
              src={action.icon}
              alt={action.title}
              className="mb-3 h-11 w-11 object-contain"
            />

            <span className="text-center text-xs font-semibold leading-tight text-slate-900">
              {action.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;