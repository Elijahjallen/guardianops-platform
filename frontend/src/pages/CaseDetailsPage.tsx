import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import EditCaseModal from "../components/cases/EditCaseModal";
import {
  generateAISummary,
  getCaseActivities,
  getCaseById,
} from "../services/api";

type CaseData = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
  casePriority?: string;
  quoteAmount?: number | null;
  quoteStatus?: string;
  assignedCaseManager?: string;
  assignedFieldStaff?: string;
  pickupLocation?: string;
  destinationLocation?: string;
  schedulingStatus?: string;
  travelBooked?: boolean;
  flightConfirmation?: string;
  hotelConfirmation?: string;
  aiSummary?: string | null;
};

type CaseActivity = {
  id: string;
  caseId: string;
  caseNumber: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
};

function CaseDetailsPage() {
  const { caseId } = useParams<{ caseId: string }>();
  const location = useLocation();
  const id = caseId || location.pathname.split("/").pop();

  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [activities, setActivities] = useState<CaseActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadCaseDetails = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      const data = await getCaseById(id);
      setCaseData(data);

      const activityData = await getCaseActivities(id);
      setActivities(activityData);
    } catch (error) {
      console.error("Failed to fetch case details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCaseDetails();
  }, [id]);

  const handleGenerateAISummary = async () => {
    if (!id) return;

    try {
      setIsGeneratingSummary(true);
      const updatedCase = await generateAISummary(id);
      setCaseData(updatedCase);

      const activityData = await getCaseActivities(id);
      setActivities(activityData);
    } catch (error) {
      console.error("Failed to generate AI summary:", error);
      alert("Failed to generate AI summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-gray-600">Loading case details...</div>
      </DashboardLayout>
    );
  }

  if (!caseData) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p className="text-gray-600">Case not found.</p>
          <Link to="/cases" className="text-sm font-semibold text-blue-700">
            Back to Cases
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
          <div>
            <Link to="/cases" className="text-sm font-semibold text-blue-700">
              ← Back to Cases
            </Link>

            <h1 className="mt-3 text-2xl font-bold text-gray-900">
              Case {caseData.caseNumber}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {caseData.clientName}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Edit Case
            </button>

            <button
              onClick={handleGenerateAISummary}
              disabled={isGeneratingSummary}
              className="rounded-lg bg-[#001333] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b2559] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGeneratingSummary ? "Generating..." : "Generate AI Summary"}
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Case Information">
            <Detail label="Client Name" value={caseData.clientName} />
            <Detail label="Status" value={caseData.status} />
            <Detail label="Priority" value={caseData.casePriority} />
            <Detail label="Destination" value={caseData.destination} />
            <Detail
              label="Pickup Date"
              value={
                caseData.pickupDate
                  ? new Date(caseData.pickupDate).toLocaleDateString()
                  : "Not provided"
              }
            />
            <Detail label="Staff Name" value={caseData.staffName} />
          </Card>

          <Card title="Assignment & Scheduling">
            <Detail label="Case Manager" value={caseData.assignedCaseManager} />
            <Detail label="Field Staff" value={caseData.assignedFieldStaff} />
            <Detail label="Pickup Location" value={caseData.pickupLocation} />
            <Detail
              label="Destination Location"
              value={caseData.destinationLocation}
            />
            <Detail
              label="Scheduling Status"
              value={caseData.schedulingStatus}
            />
          </Card>

          <Card title="Quote Details">
            <Detail
              label="Quote Amount"
              value={
                caseData.quoteAmount != null
                  ? `$${caseData.quoteAmount.toFixed(2)}`
                  : "Not provided"
              }
            />
            <Detail label="Quote Status" value={caseData.quoteStatus} />
          </Card>

          <Card title="Travel Details">
            <Detail
              label="Travel Booked"
              value={caseData.travelBooked ? "Yes" : "No"}
            />
            <Detail
              label="Flight Confirmation"
              value={caseData.flightConfirmation}
            />
            <Detail
              label="Hotel Confirmation"
              value={caseData.hotelConfirmation}
            />
          </Card>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              AI Case Summary
            </h2>

            {caseData.aiSummary && (
              <button
                onClick={handleGenerateAISummary}
                disabled={isGeneratingSummary}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGeneratingSummary ? "Regenerating..." : "Regenerate"}
              </button>
            )}
          </div>

          {caseData.aiSummary ? (
            <pre className="whitespace-pre-wrap rounded-lg bg-gray-50 p-4 text-sm leading-6 text-gray-700">
              {caseData.aiSummary}
            </pre>
          ) : (
            <p className="text-sm text-gray-500">
              No AI summary has been generated yet.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Automated Case Timeline
          </h2>

          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="border-l-4 border-[#001333] bg-gray-50 p-4"
                >
                  <div className="flex flex-col justify-between gap-1 md:flex-row md:items-center">
                    <h3 className="font-semibold text-gray-900">
                      {activity.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {new Date(activity.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-700">
                    {activity.description}
                  </p>

                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Created by: {activity.createdBy}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No timeline activity has been recorded yet.
            </p>
          )}
        </div>

        <EditCaseModal
          isOpen={isEditModalOpen}
          caseItem={caseData}
          onClose={() => setIsEditModalOpen(false)}
          onCaseUpdated={async () => {
            if (!id) return;

            const updatedCase = await getCaseById(id);
            setCaseData(updatedCase);

            const activityData = await getCaseActivities(id);
            setActivities(activityData);

            setIsEditModalOpen(false);
          }}
        />
      </div>
    </DashboardLayout>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2>
      <div className="space-y-3 text-sm">{children}</div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-100 pb-2">
      <span className="font-medium text-gray-500">{label}</span>
      <span className="text-right font-semibold text-gray-900">
        {value || "Not provided"}
      </span>
    </div>
  );
}

export default CaseDetailsPage;