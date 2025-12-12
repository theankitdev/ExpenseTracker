import express from "express";
import { addExpense, getExpenses, getAnalytics } from "../controller/expenseController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", auth, addExpense);
router.get("/", auth, getExpenses);
router.get("/analytics", auth, getAnalytics);

export default router;
