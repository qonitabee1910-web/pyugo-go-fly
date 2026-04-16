import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

/**
 * ProtectedRoute component that wraps routes requiring authentication
 * Shows loading state while checking auth status
 * Redirects to login if not authenticated
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps): ReactNode {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // TODO: Add role-based access control when user roles are available
  if (requiredRole) {
    // const userRole = user.user_metadata?.role;
    // if (userRole !== requiredRole) {
    //   return <Navigate to="/" replace />;
    // }
  }

  return children;
}
