import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: Date,
  category: String,
  amount: Number,
  note: String,
});

export default mongoose.model("Expense", expenseSchema);
