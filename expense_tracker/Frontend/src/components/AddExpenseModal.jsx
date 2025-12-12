import { useState } from "react";
import API from "../axios/axios.js";

export default function AddExpenseModal({ onClose, onAdd }) {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");

  const handleAdd = async () => {
    await API.post("/expenses/add", { category, amount, note, date });
    onAdd();
    onClose();
  };

  return (
    <div className="modal">
      <h3>Add Expense</h3>
      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <input placeholder="Category" onChange={(e) => setCategory(e.target.value)} />
      <input placeholder="Amount" onChange={(e) => setAmount(e.target.value)} />
      <input placeholder="Note" onChange={(e) => setNote(e.target.value)} />
      <button onClick={handleAdd}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
