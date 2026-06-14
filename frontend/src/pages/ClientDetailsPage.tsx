import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import EditClientModal from "../components/clients/EditClientModal";
import { getCases, getClientById, deleteClient } from "../services/api";

type ApiClient = {
  id: string;
  clientCode: string;
  name: string;
  type: string;
  contact: string;
  phone: string;
  email: string;
  location: string;
};

type ApiCase = {
  id: string;
  caseNumber: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string | null;
};

function ClientDetailsPage() {
  const navigate = useNavigate();
  const { clientId } = useParams();

  const [client, setClient] = useState<ApiClient | null>(null);
  const [cases, setCases] = useState<ApiCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);

  async function loadClientDetails() {
    if (!clientId) return;

    try {
      setIsLoading(true);

      const [clientData, caseData] = await Promise.all([
        getClientById(clientId),
        getCases(),
      ]);

      setClient(clientData);
      setCases(caseData);
    } catch (error) {
      console.error("Failed to load client details:", error);
      setClient(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClientDetails();
  }, [clientId]);

  async function handleDeleteClient() {
    if (!client) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${client.name}?`
    );

    if (!confirmed) return;

    try {
      await deleteClient(client.id);
      navigate("/clients");
    } catch (error) {
      console.error("Failed to delete client:", error);
    }
  }

  const clientCases = client
    ? cases.filter((caseItem) => caseItem.clientName === client.name)
    : [];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 font-semibold text-slate-500 shadow-sm">
          Loading client from database...
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout>
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-slate-950">
            Client Not Found
          </h1>

          <button
            onClick={() => navigate("/clients")}
            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
          >
            Back to Clients
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
            onClick={() => navigate("/clients")}
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Clients
          </button>

          <h1 className="mt-3 text-4xl font-bold text-slate-950">
            {client.name}
          </h1>

          <p className="mt-2 text-slate-500">
            Database-backed client profile, contact details, and associated cases.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="rounded-xl border border-blue-600 px-6 py-3 font-bold text-blue-600 hover:bg-blue-50"
          >
            Edit Client
          </button>

          <button
            onClick={handleDeleteClient}
            className="rounded-xl border border-red-500 px-6 py-3 font-bold text-red-600 hover:bg-red-50"
          >
            Delete Client
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
            {getInitials(client.name)}
          </div>

          <h2 className="mt-5 text-2xl font-bold text-slate-950">
            {client.name}
          </h2>

          <p className="mt-1 text-slate-500">{client.type}</p>

          <div className="mt-8 space-y-5">
            <Detail label="Client Code" value={client.clientCode} />
            <Detail label="Location" value={client.location} />
            <Detail label="Open Cases" value={clientCases.length.toString()} />
          </div>
        </aside>

        <div className="space-y-6">
          <InfoCard title="Client Information">
            <DetailGrid>
              <Detail label="Client Name" value={client.name} />
              <Detail label="Client Type" value={client.type} />
              <Detail label="Location" value={client.location} />
              <Detail label="Client Code" value={client.clientCode} />
            </DetailGrid>
          </InfoCard>

          <InfoCard title="Primary Contact">
            <DetailGrid>
              <Detail label="Contact Name" value={client.contact} />
              <Detail label="Phone" value={client.phone} />
              <Detail label="Email" value={client.email} />
            </DetailGrid>
          </InfoCard>

          <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-6">
              <h2 className="text-2xl font-bold text-slate-950">
                Associated Cases
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
                  <tr>
                    <th className="px-6 py-4">Case #</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Assigned Staff</th>
                    <th className="px-6 py-4">Destination</th>
                    <th className="px-6 py-4">Pickup Date</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {clientCases.map((caseItem) => (
                    <tr
                      key={caseItem.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5 font-bold text-slate-950">
                        {caseItem.caseNumber}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {caseItem.status}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {caseItem.staffName || "Unassigned"}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {caseItem.destination}
                      </td>

                      <td className="px-6 py-5 text-slate-700">
                        {formatDate(caseItem.pickupDate)}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => navigate(`/cases/${caseItem.id}`)}
                          className="font-bold text-blue-600 hover:text-blue-700"
                        >
                          View Case
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {clientCases.length === 0 && (
                <div className="p-8 text-center font-semibold text-slate-500">
                  No cases associated with this client.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <EditClientModal
        isOpen={isEditOpen}
        client={client}
        onClose={() => setIsEditOpen(false)}
        onClientUpdated={loadClientDetails}
      />
    </DashboardLayout>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-2xl font-bold text-slate-950">{title}</h2>
      {children}
    </section>
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
      <p className="mt-1 font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

export default ClientDetailsPage;