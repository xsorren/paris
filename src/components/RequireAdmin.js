// components/RequireAdmin.js
import { Navigate } from "react-router-dom";

const RequireAdmin = ({ children }) => {
  const isAdmin = localStorage.getItem("isAdmin") === "true" || sessionStorage.getItem("isAdmin") === "true";
  return isAdmin ? children : <Navigate to="/login" />;
};

export default RequireAdmin;
