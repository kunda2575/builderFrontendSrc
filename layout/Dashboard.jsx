// src/components/Dashboard.js
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import AppRoutes from '../routes/routes';
import Navbar from './Navbar';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const loginToken = localStorage.getItem('loginToken');
  const path = location.pathname.toLowerCase().replace(/\/+$/, '');

  const publicRoutes = ['/login', '/signup', '/forgotpassword'];
  const isPublicRoute = publicRoutes.includes(path);
  const shouldShowNavbar = !isPublicRoute;

  useEffect(() => {
    // Redirect to home if logged in and trying to access login/signup
    if (loginToken && isPublicRoute) {
      navigate('/');
    }

    // Redirect to login if not logged in and accessing private routes
    if (!loginToken && !isPublicRoute) {
      navigate('/login');
    }
  }, [loginToken, isPublicRoute, navigate]);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <AppRoutes />
    </>
  );
};

export default Dashboard;
