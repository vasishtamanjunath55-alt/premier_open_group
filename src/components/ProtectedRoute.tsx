import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, userRole, userStatus, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admins bypass approval check
  if (userRole !== 'admin') {
    // Check if user is approved
    if (userStatus === 'rejected') {
      return <Navigate to="/login" replace />;
    }
    
    if (userStatus !== 'approved') {
      return <Navigate to="/pending-approval" replace />;
    }
  }

  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/member" replace />;
  }

  return <>{children}</>;
}
