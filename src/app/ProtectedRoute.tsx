import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@app/store/hooks";
import { selectIsAuthenticated } from "@features/auth/model/slice";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
