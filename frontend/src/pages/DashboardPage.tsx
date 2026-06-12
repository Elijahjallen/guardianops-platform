import DashboardLayout from "../components/dashboard/DashboardLayout";
import QuickStats from "../components/dashboard/QuickStats";
import ActiveCasesTable from "../components/dashboard/ActiveCasesTable";
import RecentAlerts from "../components/dashboard/RecentAlerts";
import QuickActions from "../components/dashboard/QuickActions";
import CaseStatusOverview from "../components/dashboard/CaseStatusOverview";
import UpcomingPickups from "../components/dashboard/UpcomingPickups";
import FieldStaffStatus from "../components/dashboard/FieldStaffStatus";

function DashboardPage() {
  return (
    <DashboardLayout>
      <QuickStats />

      <div className="mt-6 grid items-stretch gap-6 2xl:grid-cols-[minmax(0,1fr)_320px]">
        <ActiveCasesTable />

        <aside className="grid h-full grid-rows-[1fr_auto] gap-6">
          <RecentAlerts />
          <QuickActions />
        </aside>
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-3">
        <CaseStatusOverview />
        <UpcomingPickups />
        <FieldStaffStatus />
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;