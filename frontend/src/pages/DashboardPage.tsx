import DashboardLayout from "../layouts/DashboardLayout";
import ActiveCasesTable from "../components/ActiveCasesTable";

function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Active Cases" value="14" />
        <MetricCard title="Pending Quotes" value="6" />
        <MetricCard title="Field Staff Active" value="8" />
        <MetricCard title="Open Expenses" value="$4,280" />
      </div>

      <ActiveCasesTable />
    </DashboardLayout>
  );
}

type MetricCardProps = {
  title: string;
  value: string;
};

function MetricCard({ title, value }: MetricCardProps) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-4xl font-extrabold text-slate-950">{value}</p>
    </div>
  );
}

export default DashboardPage;