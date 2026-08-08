import { Navigate } from "react-router-dom";
import { storage } from "../services/storage";
import { canAccess } from "../utils/permissions";

interface Props {
  children: React.ReactNode;
  requiredPermission?: string;
  requiredResource?: string;
  requiredAction?: string;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredResource,
  requiredAction,
}: Props) {
  const token = storage.getAccess();
  const user = storage.getUser();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  const permission = requiredPermission ?? (requiredResource && requiredAction ? `${requiredResource}.${requiredAction}` : undefined);

  if (permission && !canAccess(user, requiredResource ?? permission.split(".")[0], requiredAction ?? permission.split(".")[1])) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}