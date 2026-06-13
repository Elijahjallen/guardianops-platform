import { useCaseStore } from "../store/caseStore";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const clients = [
  {
    id: "CL-001",
    name: "Orange County Schools",
    type: "School District",
    contact: "Rebecca Adams",
    phone: "(714) 555-0192",
    email: "rebecca.adams@ocs.org",
    location: "Orange County, CA",
  },
  {
    id: "CL-002",
    name: "Safe Harbor Agency",
    type: "Youth Services",
    contact: "Thomas Miller",
    phone: "(208) 555-0138",
    email: "tmiller@safeharbor.org",
    location: "Boise, ID",
  },
  {
    id: "CL-003",
    name: "Family Services Inc.",
    type: "Family Support",
    contact: "Angela Davis",
    phone: "(602) 555-0174",
    email: "angela.davis@familyservices.com",
    location: "Phoenix, AZ",
  },
];

function ClientDirectoryPage() {
  const cases = useCaseStore((state) => state.cases);

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

        <button className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700">
          + Add Client
        </button>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-950">
            Clients
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-slate-50 text-sm font-bold uppercase text-slate-600">
              <tr>
                <th className="px-6 py-4">Client ID</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Primary Contact</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Open Cases</th>
                <th className="px-6 py-4">Contact</th>
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
                      {client.id}
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}

export default ClientDirectoryPage;