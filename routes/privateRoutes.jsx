import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/auth/login/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // or a spinner

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
