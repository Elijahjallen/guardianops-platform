import { Route, Routes } from "react-router-dom";

import LoginPage from "../pages/LoginPage";

import DashboardPage from "../pages/DashboardPage";
import CasesPage from "../pages/CasesPage";
import CaseDetailsPage from "../pages/CaseDetailsPage";
import FieldStaffPage from "../pages/FieldStaffPage";
import StaffDetailsPage from "../pages/StaffDetailsPage";
import ClientDirectoryPage from "../pages/ClientDirectoryPage";
import ClientDetailsPage from "../pages/ClientDetailsPage";
import NotificationsPage from "../pages/NotificationsPage";
import ReportsPage from "../pages/ReportsPage";
import SchedulingPage from "../pages/SchedulingPage";
import UserManagementPage from "../pages/UserManagementPage";
import ParentDashboardPage from "../pages/ParentDashboardPage";
import IntakeFormPage from "../pages/IntakeFormPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/intake" element={<IntakeFormPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cases"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Employee", "Case Manager", "Field Staff"]}
          >
            <CasesPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/cases/:caseId"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Employee", "Case Manager", "Field Staff"]}
          >
            <CaseDetailsPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/field-staff"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Employee", "Case Manager"]}
          >
            <FieldStaffPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/field-staff/:staffId"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Employee", "Case Manager"]}
          >
            <StaffDetailsPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/clients"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Case Manager", "Client"]}
          >
            <ClientDirectoryPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/clients/:clientId"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Case Manager", "Client"]}
          >
            <ClientDetailsPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <RoleProtectedRoute
            allowedRoles={[
              "Admin",
              "Employee",
              "Case Manager",
              "Field Staff",
              "Parent",
              "Client",
            ]}
          >
            <NotificationsPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/parent-dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["Parent"]}>
            <ParentDashboardPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <RoleProtectedRoute allowedRoles={["Admin", "Case Manager", "Client"]}>
            <ReportsPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/scheduling"
        element={
          <RoleProtectedRoute
            allowedRoles={["Admin", "Employee", "Case Manager", "Field Staff"]}
          >
            <SchedulingPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <UserManagementPage />
          </RoleProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;