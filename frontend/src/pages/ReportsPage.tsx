import { useEffect, useState, type ReactNode } from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import {
  getCases,
  getClients,
  getDashboardStats,
  getStaff,
  getReportCasesByStatus,
  getReportQuotesByStatus,
  getReportExpensesByCategory,
  getReportRevenueByMonth,
  getReportStaffUtilization,
  getReportExecutiveSummary,
} from "../services/api";

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
  assignedCaseManager?: string | null;
  assignedFieldStaff?: string | null;
  quoteAmount?: number | null;
  quoteStatus?: string | null;
  totalExpense?: number | null;
};

type ApiStaff = {
  id: string;
  employeeId: string;
  name: string;
  role: string;
  status: string;
  homeAirport: string;
};

type ApiClient = {
  id: string;
  clientCode: string;
  name: string;
  type: string;
  location: string;
};

type DashboardStats = {
  totalCases: number;
  pendingCases: number;
  upcomingPickups: number;
  averageCaseValue: number;
};

type ExecutiveSummaryReport = {
  totalCases: number;
  approvedRevenue: number;
  revenuePipeline: number;
  totalExpenses: number;
  projectedProfit: number;
  quoteConversionRate: number;
  approvedQuotes: number;
  sentOrApprovedQuotes: number;
};

type CaseStatusReport = {
  status: string;
  _count: {
    status: number;
  };
};

type QuoteStatusReport = {
  quoteStatus: string | null;
  _count: {
    quoteStatus: number;
  };
};

type ExpenseCategoryReport = {
  category: string;
  total: number;
};

type RevenueByMonthReport = {
  month: string;
  revenue: number;
};

type StaffUtilizationReport = {
  employeeId: string;
  staffName: string;
  role: string;
  status: string;
  homeAirport: string;
  assignedCases: number;
};

function ReportsPage() {
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [staff, setStaff] = useState<ApiStaff[]>([]);
  const [clients, setClients] = useState<ApiClient[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [executiveSummary, setExecutiveSummary] =
    useState<ExecutiveSummaryReport | null>(null);

  const [casesByStatus, setCasesByStatus] = useState<CaseStatusReport[]>([]);
  const [quotesByStatus, setQuotesByStatus] = useState<QuoteStatusReport[]>([]);
  const [expensesByCategory, setExpensesByCategory] = useState<
    ExpenseCategoryReport[]
  >([]);
  const [revenueByMonth, setRevenueByMonth] = useState<RevenueByMonthReport[]>(
    []
  );
  const [staffUtilization, setStaffUtilization] = useState<
    StaffUtilizationReport[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadReportsData() {
      try {
        const [
          caseData,
          staffData,
          clientData,
          statsData,
          executiveSummaryData,
          caseStatusData,
          quoteStatusData,
          expenseCategoryData,
          revenueMonthData,
          staffUtilizationData,
        ] = await Promise.all([
          getCases(),
          getStaff(),
          getClients(),
          getDashboardStats(),
          getReportExecutiveSummary(),
          getReportCasesByStatus(),
          getReportQuotesByStatus(),
          getReportExpensesByCategory(),
          getReportRevenueByMonth(),
          getReportStaffUtilization(),
        ]);

        setCases(caseData);
        setStaff(staffData);
        setClients(clientData);
        setStats(statsData);
        setExecutiveSummary(executiveSummaryData);
        setCasesByStatus(caseStatusData);
        setQuotesByStatus(quoteStatusData);
        setExpensesByCategory(expenseCategoryData);
        setRevenueByMonth(revenueMonthData);
        setStaffUtilization(staffUtilizationData);
      } catch (error) {
        console.error("Failed to load report data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadReportsData();
  }, []);

  const activeStaff = staff.filter(
    (member) => member.status === "Available" || member.status === "En Route"
  ).length;

  const topRevenueCases = [...cases]
    .sort((a, b) => (b.quoteAmount || 0) - (a.quoteAmount || 0))
    .slice(0, 5);

  const totalCaseStatusCount = casesByStatus.reduce(
    (total, item) => total + item._count.status,
    0
  );

  const totalQuoteStatusCount = quotesByStatus.reduce(
    (total, item) => total + item._count.quoteStatus,
    0
  );

  const totalExpenseAmount = expensesByCategory.reduce(
    (total, item) => total + Number(item.total || 0),
    0
  );

  const maxRevenueMonth = Math.max(
    ...revenueByMonth.map((item) => item.revenue),
    0
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-slate-950">Reports</h1>

        <p className="mt-2 text-slate-500">
          Executive reporting powered by PostgreSQL report APIs for Power BI,
          SQL screenshots, and portfolio analytics.
        </p>
      </div>

      {isLoading && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 font-semibold text-slate-500">
          Loading live report data from PostgreSQL...
        </div>
      )}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ReportCard
          title="Revenue Pipeline"
          value={formatCurrency(executiveSummary?.revenuePipeline || 0)}
          subtitle="Sent + approved quote value"
        />

        <ReportCard
          title="Approved Revenue"
          value={formatCurrency(executiveSummary?.approvedRevenue || 0)}
          subtitle={`${executiveSummary?.approvedQuotes || 0} approved quotes`}
        />

        <ReportCard
          title="Total Expenses"
          value={formatCurrency(executiveSummary?.totalExpenses || 0)}
          subtitle="Tracked transport expenses"
        />

        <ReportCard
          title="Projected Profit"
          value={formatCurrency(executiveSummary?.projectedProfit || 0)}
          subtitle="Approved revenue minus expenses"
        />

        <ReportCard
          title="Quote Conversion"
          value={`${executiveSummary?.quoteConversionRate || 0}%`}
          subtitle={`${executiveSummary?.approvedQuotes || 0} of ${
            executiveSummary?.sentOrApprovedQuotes || 0
          } sent/approved`}
        />

        <ReportCard
          title="Total Cases"
          value={(executiveSummary?.totalCases || cases.length).toString()}
          subtitle={`${stats?.pendingCases || 0} pending review`}
        />

        <ReportCard
          title="Active Staff"
          value={activeStaff.toString()}
          subtitle={`${staff.length} total employees`}
        />

        <ReportCard
          title="Upcoming Pickups"
          value={(stats?.upcomingPickups || 0).toString()}
          subtitle="Scheduled from today forward"
        />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Cases by Status">
          {casesByStatus.length === 0 ? (
            <EmptyText>No case status data available.</EmptyText>
          ) : (
            casesByStatus.map((item) => {
              const count = item._count.status;
              const percentage = totalCaseStatusCount
                ? (count / totalCaseStatusCount) * 100
                : 0;

              return (
                <ProgressRow
                  key={item.status}
                  label={item.status}
                  value={count}
                  percentage={percentage}
                />
              );
            })
          )}
        </Panel>

        <Panel title="Quote Status Breakdown">
          {quotesByStatus.length === 0 ? (
            <EmptyText>No quote status data available.</EmptyText>
          ) : (
            quotesByStatus.map((item) => {
              const label = item.quoteStatus || "Not Set";
              const count = item._count.quoteStatus;
              const percentage = totalQuoteStatusCount
                ? (count / totalQuoteStatusCount) * 100
                : 0;

              return (
                <ProgressRow
                  key={label}
                  label={label}
                  value={count}
                  percentage={percentage}
                />
              );
            })
          )}
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Expenses by Category">
          {expensesByCategory.length === 0 ? (
            <EmptyText>No expense data available.</EmptyText>
          ) : (
            expensesByCategory.map((item) => {
              const percentage = totalExpenseAmount
                ? (Number(item.total || 0) / totalExpenseAmount) * 100
                : 0;

              return (
                <ProgressRow
                  key={item.category}
                  label={`${item.category} — ${formatCurrency(item.total)}`}
                  value={Math.round(percentage)}
                  percentage={percentage}
                />
              );
            })
          )}
        </Panel>

        <Panel title="Revenue by Month">
          {revenueByMonth.length === 0 ? (
            <EmptyText>No approved revenue by month yet.</EmptyText>
          ) : (
            revenueByMonth.map((item) => {
              const percentage = maxRevenueMonth
                ? (item.revenue / maxRevenueMonth) * 100
                : 0;

              return (
                <ProgressRow
                  key={item.month}
                  label={`${item.month} — ${formatCurrency(item.revenue)}`}
                  value={Math.round(percentage)}
                  percentage={percentage}
                />
              );
            })
          )}
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Top Revenue Cases">
          {topRevenueCases.length === 0 && (
            <EmptyText>No quote revenue has been entered yet.</EmptyText>
          )}

          {topRevenueCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0"
            >
              <div>
                <p className="font-bold text-slate-950">
                  {caseItem.caseNumber}
                </p>
                <p className="text-sm text-slate-500">
                  {caseItem.clientName} · {caseItem.destination}
                </p>
              </div>

              <div className="text-right">
                <p className="font-bold text-slate-950">
                  {formatCurrency(caseItem.quoteAmount || 0)}
                </p>
                <p className="text-sm text-slate-500">
                  Expenses {formatCurrency(caseItem.totalExpense || 0)}
                </p>
              </div>
            </div>
          ))}
        </Panel>

        <Panel title="Client Activity">
          {clients.map((client) => {
            const clientCases = cases.filter(
              (caseItem) => caseItem.clientName === client.name
            );

            const clientRevenue = clientCases.reduce(
              (total, caseItem) => total + (caseItem.quoteAmount || 0),
              0
            );

            return (
              <div
                key={client.id}
                className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0"
              >
                <div>
                  <p className="font-bold text-slate-950">{client.name}</p>
                  <p className="text-sm text-slate-500">
                    {client.type} · {client.location}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-slate-950">
                    {clientCases.length} cases
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatCurrency(clientRevenue)}
                  </p>
                </div>
              </div>
            );
          })}
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Staff Utilization">
          {staffUtilization.length === 0 ? (
            <EmptyText>No assigned staff utilization data yet.</EmptyText>
          ) : (
            staffUtilization.map((item) => (
              <div
                key={item.employeeId}
                className="mb-4 flex items-center justify-between border-b border-slate-100 pb-4 last:border-b-0"
              >
                <div>
                  <p className="font-bold text-slate-950">{item.staffName}</p>
                  <p className="text-sm text-slate-500">
                    {item.role} · {item.status} · {item.homeAirport}
                  </p>
                </div>

                <p className="font-bold text-slate-950">
                  {item.assignedCases} cases
                </p>
              </div>
            ))
          )}
        </Panel>

        <Panel title="Power BI Ready Data">
          <div className="space-y-4 text-slate-700">
            <p>
              These datasets are now exposed through live Express reporting APIs
              and can support Power BI visuals, SQL screenshots, and executive
              analytics.
            </p>

            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="font-bold text-slate-950">Available API datasets:</p>

              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>/api/reports/executive-summary</li>
                <li>/api/reports/cases-by-status</li>
                <li>/api/reports/quotes-by-status</li>
                <li>/api/reports/expenses-by-category</li>
                <li>/api/reports/revenue-by-month</li>
                <li>/api/reports/staff-utilization</li>
              </ul>
            </div>
          </div>
        </Panel>
      </section>
    </DashboardLayout>
  );
}

function ReportCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="font-semibold text-slate-500">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-400">{subtitle}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-2xl font-bold text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function ProgressRow({
  label,
  value,
  percentage,
}: {
  label: string;
  value: number;
  percentage: number;
}) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-3 rounded-full bg-slate-100">
        <div
          className="h-3 rounded-full bg-blue-600"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return <p className="font-semibold text-slate-500">{children}</p>;
}

function formatCurrency(amount: number) {
  return Number(amount || 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default ReportsPage;