import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { validateToken } from '../lib/auth';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { valid } = validateToken();

  if (!valid) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
