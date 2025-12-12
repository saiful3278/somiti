import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingAnimation from './common/LoadingAnimation';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Debug: trace protected route evaluation
  console.log('[ProtectedRoute] evaluating', { loading, hasUser: !!user, role: user?.role, path: location.pathname });

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a default page if the user's role is not allowed
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;