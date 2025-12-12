import Expense from "../models/Expense.js";

export const addExpense = async (req, res) => {
  const expense = await Expense.create({
    ...req.body,
    userId: req.userId,
  });
  res.json(expense);
};

export const getExpenses = async (req, res) => {
  const { category, startDate, endDate } = req.query;

  let query = { userId: req.userId };

  if (category) query.category = category;

  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  }

  const expenses = await Expense.find(query).sort({ date: -1 });
  res.json(expenses);
};

export const getAnalytics = async (req, res) => {
  const expenses = await Expense.find({ userId: req.userId });

  const totalSpend = expenses.reduce((acc, e) => acc + e.amount, 0);

  const categoryWise = {};

  expenses.forEach((e) => {
    categoryWise[e.category] = (categoryWise[e.category] || 0) + e.amount;
  });

  res.json({ totalSpend, categoryWise });
};
