import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Client = {
  id: string;
  name: string;
  type: string;
  contact: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  notes: string;
};

type ClientStore = {
  clients: Client[];
  addClient: (newClient: Client) => void;
  updateClient: (clientId: string, updatedClient: Partial<Client>) => void;
  deleteClient: (clientId: string) => void;
};

export const useClientStore = create<ClientStore>()(
  persist(
    (set) => ({
      clients: [
        {
          id: "CL-001",
          name: "Orange County Schools",
          type: "School District",
          contact: "Rebecca Adams",
          phone: "(714) 555-0192",
          email: "rebecca.adams@ocs.org",
          location: "Orange County, CA",
          address: "100 Education Way, Orange County, CA",
          notes:
            "Primary school district client for scheduled student transport cases.",
        },
        {
          id: "CL-002",
          name: "Safe Harbor Agency",
          type: "Youth Services",
          contact: "Thomas Miller",
          phone: "(208) 555-0138",
          email: "tmiller@safeharbor.org",
          location: "Boise, ID",
          address: "420 Harbor Lane, Boise, ID",
          notes: "Youth services partner with frequent urgent transport needs.",
        },
        {
          id: "CL-003",
          name: "Family Services Inc.",
          type: "Family Support",
          contact: "Angela Davis",
          phone: "(602) 555-0174",
          email: "angela.davis@familyservices.com",
          location: "Phoenix, AZ",
          address: "810 Family Center Drive, Phoenix, AZ",
          notes: "Family support agency with recurring case coordination.",
        },
      ],

      addClient: (newClient) =>
        set((state) => ({
          clients: [newClient, ...state.clients],
        })),

      updateClient: (clientId, updatedClient) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId ? { ...client, ...updatedClient } : client
          ),
        })),

      deleteClient: (clientId) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== clientId),
        })),
    }),
    {
      name: "guardianops-client-store",
    }
  )
);