import Sidebar from "./Sidebar";
import TopNavigation from "./TopNavigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 xl:flex">
      <Sidebar />

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <TopNavigation />

        <main className="min-w-0 flex-1 overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;