import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SchedulingPage from "../pages/SchedulingPage";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import CasesPage from "../pages/CasesPage";
import CaseDetailsPage from "../pages/CaseDetailsPage";
import FieldStaffPage from "../pages/FieldStaffPage";
import NotificationsPage from "../pages/NotificationsPage";
import ReportsPage from "../pages/ReportsPage";
import StaffDetailsPage from "../pages/StaffDetailsPage";
import ClientDirectoryPage from "../pages/ClientDirectoryPage";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientDirectoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/scheduling"
          element={
            <ProtectedRoute>
              <SchedulingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <CasesPage />
            </ProtectedRoute>
          }
        />

       <Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  }
  />    
        <Route
          path="/cases/:caseId"
          element={
            <ProtectedRoute>
              <CaseDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/field-staff"
          element={
            <ProtectedRoute>
              <FieldStaffPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/field-staff/:staffId"
          element={
            <ProtectedRoute>
              <StaffDetailsPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;