import React from "react";
import useAuthStore from "../store/authStore";
import { Navigate, Outlet } from "react-router-dom";
const PublicRoute = () => {
  const userData = useAuthStore();
  if (userData.isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <>
      <Outlet />
    </>
  );
};

export default PublicRoute;
