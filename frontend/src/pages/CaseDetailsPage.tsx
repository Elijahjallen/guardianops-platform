import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import jsPDF from "jspdf";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import EditCaseModal from "../components/cases/EditCaseModal";
import CaseActivityTimeline from "../components/cases/CaseActivityTimeline";
import { deleteCase, getCaseById } from "../services/api";
import MessagesPanel from "../components/messages/MessagesPanel";
import CaseDocumentsPanel from "../components/documents/CaseDocumentsPanel";
import YouthProfilePanel from "../components/cases/YouthProfilePanel";
import CaseAuditHistory from "../components/cases/CaseAuditHistory";

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
  transportDate?: string | null;
  pickupLocation?: string | null;
  destinationLocation?: string | null;
  travelBooked?: boolean;
  flightConfirmation?: string | null;
  hotelConfirmation?: string | null;
  casePriority?: string;
  createdAt: string;

  quoteAmount?: number | null;
  quoteStatus?: string | null;
  quoteSentDate?: string | null;
  quoteApprovedDate?: string | null;

  scheduledPickupTime?: string | null;
  scheduledDropoffTime?: string | null;
  departureAirport?: string | null;
  arrivalAirport?: string | null;
  assignedEscortId?: string | null;
  schedulingStatus?: string | null;

  airlineName?: string | null;
  flightNumber?: string | null;
  flightDeparture?: string | null;
  flightArrival?: string | null;
  hotelName?: string | null;
  hotelCheckIn?: string | null;
  hotelCheckOut?: string | null;
  rentalCarCompany?: string | null;
  rentalConfirmation?: string | null;

  flightCost?: number | null;
  hotelCost?: number | null;
  mealCost?: number | null;
  groundCost?: number | null;
  otherCost?: number | null;
  totalExpense?: number | null;
};

function CaseDetailsPage() {
  const navigate = useNavigate();
  const { caseId } = useParams();

  const [caseItem, setCaseItem] = useState<ApiCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function loadCase() {
    if (!caseId) return;

    try {
      setIsLoading(true);
      const data = await getCaseById(caseId);
      setCaseItem(data);
    } catch (error) {
      console.error("Failed to load case:", error);
      setCaseItem(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCase();
  }, [caseId]);

  async function handleDeleteCase() {
    if (!caseItem) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${caseItem.caseNumber}?`
    );

    if (!confirmed) return;

    try {
      await deleteCase(caseItem.id);
      navigate("/cases");
    } catch (error) {
      console.error("Failed to delete case:", error);
    }
  }

  function handleGenerateQuotePdf() {
    if (!caseItem) return;

    const pdf = new jsPDF();

    pdf.setFontSize(22);
    pdf.text("GuardianOps Quote", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Case Number: ${caseItem.caseNumber}`, 20, 45);
    pdf.text(`Client: ${caseItem.clientName}`, 20, 55);
    pdf.text(`Destination: ${caseItem.destination}`, 20, 65);
    pdf.text(`Pickup Date: ${formatDate(caseItem.pickupDate)}`, 20, 75);

    pdf.text("Quote Information", 20, 95);
    pdf.text(`Quote Amount: ${formatCurrency(caseItem.quoteAmount)}`, 20, 110);
    pdf.text(`Quote Status: ${caseItem.quoteStatus || "Pending"}`, 20, 120);
    pdf.text(
      `Quote Sent Date: ${
        caseItem.quoteSentDate ? formatDate(caseItem.quoteSentDate) : "—"
      }`,
      20,
      130
    );
    pdf.text(
      `Quote Approved Date: ${
        caseItem.quoteApprovedDate
          ? formatDate(caseItem.quoteApprovedDate)
          : "—"
      }`,
      20,
      140
    );

    pdf.save(`${caseItem.caseNumber}-Quote.pdf`);
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 font-semibold text-slate-500 shadow-sm">
          Loading case from database...
        </div>
      </DashboardLayout>
    );
  }

  if (!caseItem) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">Case Not Found</h1>

          <p className="mt-2 text-slate-500">
            The case you are looking for does not exist in PostgreSQL.
          </p>

          <button
            onClick={() => navigate("/cases")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Back to Cases
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate("/cases")}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Cases
          </button>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            Case {caseItem.caseNumber}
          </h1>

          <p className="mt-2 text-slate-500">
            Database-backed transport case details, assignments, travel booking,
            expenses, documents, messages, scheduling, and activity timeline.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="rounded-xl border border-blue-600 px-6 py-3 font-bold text-blue-600 hover:bg-blue-50"
          >
            Edit Case
          </button>

          <button
            onClick={handleGenerateQuotePdf}
            className="rounded-xl border border-green-600 px-6 py-3 font-bold text-green-600 hover:bg-green-50"
          >
            Generate Quote PDF
          </button>

          <button
            onClick={handleDeleteCase}
            className="rounded-xl border border-red-500 px-6 py-3 font-bold text-red-600 hover:bg-red-50"
          >
            Delete Case
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <InfoCard title="Case Overview" status={caseItem.status}>
            <DetailGrid>
              <Detail label="Case Number" value={caseItem.caseNumber} />
              <Detail label="Client" value={caseItem.clientName} />
              <Detail label="Status" value={caseItem.status} />
              <Detail
                label="Priority"
                value={caseItem.casePriority || "Standard"}
              />
              <Detail label="Destination" value={caseItem.destination} />
              <Detail label="Created" value={formatDate(caseItem.createdAt)} />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Quote Information" quoteStatus={caseItem.quoteStatus}>
            <DetailGrid>
              <Detail
                label="Quote Amount"
                value={formatCurrency(caseItem.quoteAmount)}
              />
              <Detail
                label="Quote Status"
                value={caseItem.quoteStatus || "Pending"}
              />
              <Detail
                label="Quote Sent Date"
                value={formatDate(caseItem.quoteSentDate || "")}
              />
              <Detail
                label="Quote Approved Date"
                value={formatDate(caseItem.quoteApprovedDate || "")}
              />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Expense Summary">
            <DetailGrid>
              <Detail
                label="Flight Cost"
                value={formatCurrency(caseItem.flightCost)}
              />

              <Detail
                label="Hotel Cost"
                value={formatCurrency(caseItem.hotelCost)}
              />

              <Detail
                label="Meal Cost"
                value={formatCurrency(caseItem.mealCost)}
              />

              <Detail
                label="Ground Transportation"
                value={formatCurrency(caseItem.groundCost)}
              />

              <Detail
                label="Other Cost"
                value={formatCurrency(caseItem.otherCost)}
              />

              <Detail
                label="Total Expenses"
                value={formatCurrency(caseItem.totalExpense)}
              />

              <Detail
                label="Projected Profit"
                value={formatCurrency(
                  (caseItem.quoteAmount || 0) - (caseItem.totalExpense || 0)
                )}
              />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Assignment">
            <DetailGrid>
              <Detail
                label="Case Manager"
                value={caseItem.assignedCaseManager || "Unassigned"}
              />
              <Detail
                label="Field Staff"
                value={caseItem.assignedFieldStaff || "Unassigned"}
              />
            </DetailGrid>
          </InfoCard>

          <InfoCard
            title="Scheduling Information"
            status={caseItem.schedulingStatus || "Not Scheduled"}
          >
            <DetailGrid>
              <Detail
                label="Scheduling Status"
                value={caseItem.schedulingStatus || "Not Scheduled"}
              />

              <Detail
                label="Assigned Escort"
                value={caseItem.assignedEscortId || "Unassigned"}
              />

              <Detail
                label="Scheduled Pickup Time"
                value={formatDateTime(caseItem.scheduledPickupTime || "")}
              />

              <Detail
                label="Scheduled Dropoff Time"
                value={formatDateTime(caseItem.scheduledDropoffTime || "")}
              />

              <Detail
                label="Departure Airport"
                value={caseItem.departureAirport || "Not Scheduled"}
              />

              <Detail
                label="Arrival Airport"
                value={caseItem.arrivalAirport || "Not Scheduled"}
              />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Travel Booking">
            <DetailGrid>
              <Detail
                label="Airline"
                value={caseItem.airlineName || "Not Booked"}
              />

              <Detail
                label="Flight Number"
                value={caseItem.flightNumber || "Not Assigned"}
              />

              <Detail
                label="Flight Departure"
                value={
                  caseItem.flightDeparture
                    ? formatDateTime(caseItem.flightDeparture)
                    : "Not Scheduled"
                }
              />

              <Detail
                label="Flight Arrival"
                value={
                  caseItem.flightArrival
                    ? formatDateTime(caseItem.flightArrival)
                    : "Not Scheduled"
                }
              />

              <Detail
                label="Hotel Name"
                value={caseItem.hotelName || "Not Booked"}
              />

              <Detail
                label="Hotel Check-In"
                value={
                  caseItem.hotelCheckIn
                    ? formatDate(caseItem.hotelCheckIn)
                    : "Not Scheduled"
                }
              />

              <Detail
                label="Hotel Check-Out"
                value={
                  caseItem.hotelCheckOut
                    ? formatDate(caseItem.hotelCheckOut)
                    : "Not Scheduled"
                }
              />

              <Detail
                label="Rental Car Company"
                value={caseItem.rentalCarCompany || "Not Reserved"}
              />

              <Detail
                label="Rental Confirmation"
                value={caseItem.rentalConfirmation || "Pending"}
              />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Transport Details">
            <DetailGrid>
              <Detail
                label="Pickup Date"
                value={formatDate(caseItem.pickupDate)}
              />
              <Detail
                label="Transport Date"
                value={formatDate(caseItem.transportDate || "")}
              />
              <Detail
                label="Pickup Location"
                value={caseItem.pickupLocation || "Not provided"}
              />
              <Detail
                label="Destination Location"
                value={caseItem.destinationLocation || "Not provided"}
              />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Travel Details">
            <DetailGrid>
              <Detail
                label="Travel Booked"
                value={caseItem.travelBooked ? "Yes" : "No"}
              />
              <Detail
                label="Flight Confirmation"
                value={caseItem.flightConfirmation || "Not provided"}
              />
              <Detail
                label="Hotel Confirmation"
                value={caseItem.hotelConfirmation || "Not provided"}
              />
            </DetailGrid>
          </InfoCard>

          <YouthProfilePanel caseId={caseItem.id} />

          <CaseActivityTimeline
            caseId={caseItem.id}
            caseNumber={caseItem.caseNumber}
          />

          <MessagesPanel caseId={caseItem.id} />

          <CaseDocumentsPanel
            caseId={caseItem.id}
            caseNumber={caseItem.caseNumber}
          />

          <CaseAuditHistory caseId={caseItem.id} />
        </section>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-950">
            Activity Summary
          </h2>

          <div className="mt-6 space-y-5">
            <TimelineItem title="Case loaded from database" time="Just now" />
            <TimelineItem title={`Status: ${caseItem.status}`} time="Current" />
            <TimelineItem
              title={`Quote Status: ${caseItem.quoteStatus || "Pending"}`}
              time="Current"
            />
            <TimelineItem
              title={`Scheduling: ${
                caseItem.schedulingStatus || "Not Scheduled"
              }`}
              time="Current"
            />
            <TimelineItem
              title={`Travel Booked: ${caseItem.travelBooked ? "Yes" : "No"}`}
              time="Current"
            />
            <TimelineItem
              title={`Airline: ${caseItem.airlineName || "Not Booked"}`}
              time="Current"
            />
            <TimelineItem
              title={`Priority: ${caseItem.casePriority || "Standard"}`}
              time="Current"
            />
            <TimelineItem
              title={`Case Manager: ${
                caseItem.assignedCaseManager || "Unassigned"
              }`}
              time="Current"
            />
            <TimelineItem
              title={`Field Staff: ${
                caseItem.assignedFieldStaff || "Unassigned"
              }`}
              time="Current"
            />
          </div>
        </aside>
      </div>

      <EditCaseModal
        isOpen={isEditOpen}
        caseItem={caseItem}
        onClose={() => setIsEditOpen(false)}
        onCaseUpdated={loadCase}
      />
    </DashboardLayout>
  );
}

function InfoCard({
  title,
  status,
  quoteStatus,
  children,
}: {
  title: string;
  status?: string;
  quoteStatus?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>

        {status && <StatusBadge status={status} />}
        {quoteStatus && <QuoteStatusBadge status={quoteStatus} />}
      </div>

      <div className="mt-6">{children}</div>
    </div>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 md:grid-cols-2">{children}</div>;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-semibold text-slate-950">
        {value || "Not provided"}
      </p>
    </div>
  );
}

function TimelineItem({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex gap-4">
      <span className="mt-1 h-3 w-3 rounded-full bg-blue-600" />

      <div>
        <p className="font-semibold text-slate-950">{title}</p>
        <p className="text-sm text-slate-500">{time}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Not Scheduled": "bg-slate-100 text-slate-700",
    "Scheduling Pending": "bg-amber-100 text-amber-700",
    Scheduled: "bg-purple-100 text-purple-700",
    "Travel Booked": "bg-green-100 text-green-700",
    "Under Review": "bg-amber-100 text-amber-700",
    "Ready For Transport": "bg-indigo-100 text-indigo-700",
    "En Route": "bg-blue-100 text-blue-700",
    Pending: "bg-orange-100 text-orange-700",
    "In Progress": "bg-sky-100 text-sky-700",
    "In Transit": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1 text-sm font-bold ${
        styles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

function QuoteStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-gray-100 text-gray-700",
    Drafted: "bg-blue-100 text-blue-700",
    Sent: "bg-yellow-100 text-yellow-700",
    Approved: "bg-green-100 text-green-700",
    Declined: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-lg px-3 py-1 text-sm font-bold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function formatDateTime(dateValue: string) {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (!dateValue || Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCurrency(amount?: number | null) {
  if (amount === null || amount === undefined) {
    return "—";
  }

  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default CaseDetailsPage;