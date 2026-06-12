import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <TopNav />

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;