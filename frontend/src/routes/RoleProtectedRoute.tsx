import { Navigate } from "react-router-dom";

type RoleProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const token = localStorage.getItem("guardianops-token");
  const storedUser = localStorage.getItem("guardianops-user");

  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  const user = JSON.parse(storedUser);

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default RoleProtectedRoute;