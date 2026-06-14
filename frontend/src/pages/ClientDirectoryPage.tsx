import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import AddClientModal from "../components/clients/AddClientModal";
import { useCaseStore } from "../store/caseStore";
import { getClients } from "../services/api";

type ApiClient = {
  id: string;
  clientCode: string;
  name: string;
  type: string;
  contact: string;
  phone: string;
  email: string;
  location: string;
  createdAt: string;
};

function ClientDirectoryPage() {
  const navigate = useNavigate();

  const cases = useCaseStore((state) => state.cases);

  const [clients, setClients] = useState<ApiClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  useEffect(() => {
    async function loadClients() {
      try {
        const data = await getClients();
        setClients(data);
      } catch (error) {
        console.error("Failed to load clients:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadClients();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-950">
            Client Directory
          </h1>

          <p className="mt-2 text-slate-500">
            Manage client agencies, contacts, and associated transport cases.
          </p>
        </div>

        <button
          onClick={() => setIsAddClientOpen(true)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
        >
          + Add Client
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-950">Clients</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Client ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Primary Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Open Cases</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => {
                const clientCases = cases.filter(
                  (caseItem) => caseItem.client === client.name
                );

                return (
                  <tr
                    key={client.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-6 py-5 font-bold text-slate-950">
                      {client.clientCode}
                    </td>

                    <td className="px-6 py-5 font-semibold text-slate-800">
                      {client.name}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {client.type}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {client.contact}
                    </td>

                    <td className="px-6 py-5 text-slate-700">
                      {client.location}
                    </td>

                    <td className="px-6 py-5 font-bold text-slate-950">
                      {clientCases.length}
                    </td>

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">
                        {client.phone}
                      </p>

                      <p className="text-sm text-slate-500">
                        {client.email}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <button
                        onClick={() => navigate(`/clients/${client.id}`)}
                        className="font-bold text-blue-600 hover:text-blue-700"
                      >
                        View Client
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {isLoading && (
            <div className="p-8 text-center font-semibold text-slate-500">
              Loading clients from database...
            </div>
          )}

          {!isLoading && clients.length === 0 && (
            <div className="p-8 text-center font-semibold text-slate-500">
              No clients found.
            </div>
          )}
        </div>
      </section>

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />
    </DashboardLayout>
  );
}

export default ClientDirectoryPage;