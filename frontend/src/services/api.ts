import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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