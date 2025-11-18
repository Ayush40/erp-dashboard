import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth'; // or import hook

export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  if (!auth.user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
