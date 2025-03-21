const asyncHandler = require("express-async-handler");
const Goal = require("../model/Goal");
const Transaction = require("../model/Transaction");

const goalController = {
    // Create a goal
    create: asyncHandler(async (req, res) => {
        const { name, targetAmount, deadline } = req.body;
        if (!name || !targetAmount || !deadline) {
            throw new Error("All fields are required");
        }

        const goal = await Goal.create({
            user: req.user,
            name,
            targetAmount,
            deadline,
        });

        res.status(201).json(goal);
    }),

    // Get all goals for a user
    lists: asyncHandler(async (req, res) => {
        const goals = await Goal.find({ user: req.user });
        res.status(200).json(goals);
    }),

    // Update saved amount and progress
    updateSavedAmount: asyncHandler(async (req, res) => {
        const { goalId, amount } = req.body;
        const goal = await Goal.findById(goalId);

        if (goal && goal.user.toString() === req.user.toString()) {
            // Update saved amount
            goal.savedAmount += amount;

            // Calculate progress percentage
            goal.progress = (goal.savedAmount / goal.targetAmount) * 100;

            // Check if the goal is completed
            if (goal.savedAmount >= goal.targetAmount) {
                goal.status = "completed";
            }

            // Check if the goal has failed (deadline passed and target not met)
            if (new Date() > goal.deadline && goal.savedAmount < goal.targetAmount) {
                goal.status = "failed";
            }

            await goal.save();
            res.status(200).json(goal);
        } else {
            throw new Error("Goal not found or unauthorized");
        }
    }),

    // Automatically allocate savings from income
    allocateSavings: asyncHandler(async (req, res) => {
        const { goalId, transactionId } = req.body;

        // Find the goal and transaction
        const goal = await Goal.findById(goalId);
        const transaction = await Transaction.findById(transactionId);

        if (!goal || !transaction) {
            throw new Error("Goal or transaction not found");
        }

        // Check if the transaction is an income and belongs to the user
        if (transaction.type !== "income" || transaction.user.toString() !== req.user.toString()) {
            throw new Error("Invalid transaction for allocation");
        }

        // Allocate a portion of the income to the goal
        const allocationAmount = transaction.amount * 0.2; // Allocate 20% of income
        goal.savedAmount += allocationAmount;

        // Update progress
        goal.progress = (goal.savedAmount / goal.targetAmount) * 100;

        // Check if the goal is completed
        if (goal.savedAmount >= goal.targetAmount) {
            goal.status = "completed";
        }

        await goal.save();
        res.status(200).json({ message: "Savings allocated successfully", goal });
    }),
};

module.exports = goalController;