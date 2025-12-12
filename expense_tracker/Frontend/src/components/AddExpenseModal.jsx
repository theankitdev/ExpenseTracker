import { useState } from "react";
import API from "../axios/axios.js";
import { X } from "lucide-react";

export default function AddExpenseModal({ onClose, onAdd }) {
  const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async (e) => {
    e?.preventDefault?.();
    setError("");

    // Basic validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError("Please enter a valid amount (> 0).");
      return;
    }
    if (!category) {
      setError("Please enter a category.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);
    try {
      // Ensure we send proper types
      const payload = {
        category,
        amount: Number(amount),
        note,
        date, // backend should parse date string to Date
      };

      const res = await API.post("/expenses/add", payload);
      // optional: check success
      if (res?.data?._id) {
        // call parent refresh
        if (typeof onAdd === "function") onAdd();
        if (typeof onClose === "function") onClose();
      } else {
        console.error("Unexpected add response:", res);
        setError("Failed to add expense — unexpected response.");
      }
    } catch (err) {
      console.error("Add expense error:", err);
      // show message from backend if available
      const msg = err?.response?.data?.message || err.message || "Network error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Expense</h3>
          <button onClick={onClose} aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border rounded px-3 py-2"
              max={today}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. food, bills"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              type="number"
              step="0.01"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Note</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note"
              className="mt-1 w-full border rounded px-3 py-2"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
