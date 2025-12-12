import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Dashboard from "../Pages/Dashboard";
import ProtectedRoute from "./protectedRoutes";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
