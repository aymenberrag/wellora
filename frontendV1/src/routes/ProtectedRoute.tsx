import { Navigate } from "react-router-dom";
import { storage } from "../services/storage";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const token = storage.getAccess();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}