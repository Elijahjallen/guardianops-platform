import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type CaseData = {
  caseNumber?: string;
  clientName: string;
  status: string;
  destination: string;
  pickupDate: string;
  staffName?: string;

  assignedCaseManager?: string;
  assignedFieldStaff?: string;
  transportDate?: string;
  pickupLocation?: string;
  destinationLocation?: string;
  travelBooked?: boolean;
  flightConfirmation?: string;
  hotelConfirmation?: string;
  casePriority?: string;
};

export async function getCases() {
  const response = await api.get("/cases");
  return response.data;
}

export async function getStaff() {
  const response = await api.get("/staff");
  return response.data;
}

export async function getClients() {
  const response = await api.get("/clients");
  return response.data;
}

export async function getNotifications() {
  const response = await api.get("/notifications");
  return response.data;
}

export async function createCase(caseData: CaseData) {
  const response = await api.post("/cases", caseData);
  return response.data;
}

export async function getCaseById(caseId: string) {
  const response = await api.get(`/cases/${caseId}`);
  return response.data;
}

export async function updateCase(caseId: string, caseData: CaseData) {
  const response = await api.put(`/cases/${caseId}`, caseData);
  return response.data;
}

export async function deleteCase(caseId: string) {
  const response = await api.delete(`/cases/${caseId}`);
  return response.data;
}

export async function getClientById(clientId: string) {
  const response = await api.get(`/clients/${clientId}`);
  return response.data;
}

export async function updateClient(
  clientId: string,
  clientData: {
    clientCode: string;
    name: string;
    type: string;
    contact: string;
    phone: string;
    email: string;
    location: string;
  }
) {
  const response = await api.put(`/clients/${clientId}`, clientData);
  return response.data;
}

export async function deleteClient(clientId: string) {
  const response = await api.delete(`/clients/${clientId}`);
  return response.data;
}

export async function createClient(clientData: {
  clientCode: string;
  name: string;
  type: string;
  contact: string;
  phone: string;
  email: string;
  location: string;
}) {
  const response = await api.post("/clients", clientData);
  return response.data;
}

export async function createStaff(staffData: {
  employeeId: string;
  name: string;
  role: string;
  status: string;
  phone: string;
  email: string;
  homeAirport: string;
}) {
  const response = await api.post("/staff", staffData);
  return response.data;
}

export async function getStaffById(staffId: string) {
  const response = await api.get(`/staff/${staffId}`);
  return response.data;
}

export async function updateStaff(
  staffId: string,
  staffData: {
    employeeId: string;
    name: string;
    role: string;
    status: string;
    phone: string;
    email: string;
    homeAirport: string;
  }
) {
  const response = await api.put(`/staff/${staffId}`, staffData);
  return response.data;
}

export async function deleteStaff(staffId: string) {
  const response = await api.delete(`/staff/${staffId}`);
  return response.data;
}

export async function login(email: string, password: string) {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
}

export async function getUsers() {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function updateUser(
  userId: string,
  userData: {
    name: string;
    email: string;
    role: string;
  }
) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.put(`/users/${userId}`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function resetUserPassword(userId: string, password: string) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.put(
    `/users/${userId}/reset-password`,
    { password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

export async function deleteUser(userId: string) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.delete(`/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getDashboardStats() {
  const response = await api.get("/dashboard");
  return response.data;
}

export async function getCaseStatusCounts() {
  const response = await api.get("/dashboard/case-status");
  return response.data;
}

export async function getParentCases() {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.get("/parent/cases", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getUsersForAdmin() {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.get("/users", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getCaseActivity(caseId: string) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.get(`/case-activity/${caseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createCaseActivity(activityData: {
  caseId: string;
  caseNumber: string;
  title: string;
  description: string;
  createdBy?: string;
}) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.post("/case-activity", activityData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getMessages(caseId: string) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.get(`/messages/${caseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function sendMessage(messageData: {
  caseId: string;
  content: string;
}) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.post("/messages", messageData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function getCaseDocuments(caseId: string) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.get(`/documents/${caseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function uploadCaseDocument(formData: FormData) {
  const token = localStorage.getItem("guardianops-token");

  const response = await api.post("/documents/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function submitIntakeForm(intakeData: any) {
  const response = await api.post("/intake", intakeData);
  return response.data;
}

export async function getYouthProfile(caseId: string) {
  const response = await api.get(`/intake/youth-profile/${caseId}`);
  return response.data;
}