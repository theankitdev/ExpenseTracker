import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <h2 className="text-xl font-bold">ExpenseTracker</h2>

      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="hover:text-yellow-400">
          Dashboard
        </Link>

        <Link to="/dashboard?add=true" className="hover:text-yellow-400">
          Add Expense
        </Link>

        <button
          className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
