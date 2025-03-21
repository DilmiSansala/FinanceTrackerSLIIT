// controllers/transactionCtrl.js
const asyncHandler = require("express-async-handler");
const Transaction = require("../model/Transaction");
const axios = require("axios");
const Budget = require("../model/Budget");
const Notification = require("../model/Notification");

// Helper function to create a notification
const createNotification = async (user, message, type) => {
  await Notification.create({
    user,
    message,
    type,
  });
};

// Helper function to convert currency
const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY; // Add API key to .env
    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`
    );

    if (response.status !== 200) {
      throw new Error(`API request failed with status code ${response.status}`);
    }

    const exchangeRate = response.data.conversion_rates[toCurrency];
    if (!exchangeRate) {
      throw new Error(`Conversion rate for ${toCurrency} not found`);
    }

    return amount * exchangeRate;
  } catch (error) {
    console.error("Currency conversion error:", error.message);
    throw new Error("Failed to convert currency: " + error.message);
  }
};

// Helper function to generate recurring transactions
const generateRecurringTransactions = async (transaction) => {
  if (!transaction.recurring || !transaction.recurring.pattern) {
    return;
  }

  const { pattern, endDate } = transaction.recurring;
  const currentDate = new Date(transaction.date);
  const endDateTime = endDate ? new Date(endDate) : null;

  let nextDate;

  switch (pattern) {
    case "daily":
      nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
      break;
    case "weekly":
      nextDate = new Date(currentDate.setDate(currentDate.getDate() + 7));
      break;
    case "monthly":
      nextDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      break;
    case "yearly":
      nextDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
      break;
    default:
      throw new Error("Invalid recurring pattern");
  }

  if (endDateTime && nextDate > endDateTime) {
    return;
  }

  const newTransaction = new Transaction({
    user: transaction.user,
    type: transaction.type,
    category: transaction.category,
    amount: transaction.amount,
    currency: transaction.currency,
    date: nextDate,
    description: transaction.description,
    tags: transaction.tags,
    recurring: transaction.recurring,
  });

  await newTransaction.save();

  await generateRecurringTransactions(newTransaction);
};

const transactionController = {
  // Create a new transaction
  create: asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);
    const { type, category, amount, date, description, currency = "USD", tags, recurring } = req.body;

    if (!amount || isNaN(amount)) {
      throw new Error("Amount is required and must be a valid number");
    }
    if (!type || !date) {
      throw new Error("Type and date are required");
    }

    // Convert amount to USD if the currency is not USD
    let convertedAmount = amount;
    if (currency !== "USD") {
      convertedAmount = await convertCurrency(amount, currency, "USD");
    }

    const transaction = await Transaction.create({
      user: req.user,
      type,
      category,
      amount: convertedAmount,
      currency: currency, // Use the provided currency
      date,
      description,
      tags,
      recurring,
    });

    if (recurring && recurring.pattern) {
      await generateRecurringTransactions(transaction);
    }

    // If the type is expense, update the corresponding budget
    if (type === "expense") {
      // Update category-wise budget
      const transactionDate = new Date(date);
      const categoryBudget = await Budget.findOne({
        user: req.user,
        type: "category",
        category: category,
        startDate: { $lte: transactionDate },
        endDate: { $gte: transactionDate },
      });

      if (categoryBudget) {
        categoryBudget.currentSpending += convertedAmount; // Use converted amount
        await categoryBudget.save();

        // Check if the category budget is exceeded
        if (categoryBudget.currentSpending > categoryBudget.limit) {
          const message = `⚠️ Category budget exceeded for ${category} for the time period of ${categoryBudget.startDate.toISOString().split("T")[0]} to ${categoryBudget.endDate.toISOString().split("T")[0]} ⚠️`;
          await createNotification(req.user, message, "spending");
          console.log(message);
        }
      }

      // Update monthly budget
      const monthlyBudget = await Budget.findOne({
        user: req.user,
        type: "monthly",
        startDate: { $lte: transactionDate },
        endDate: { $gte: transactionDate },
      });

      if (monthlyBudget) {
        monthlyBudget.currentSpending += convertedAmount; // Use converted amount
        await monthlyBudget.save();

        if (monthlyBudget.currentSpending > monthlyBudget.limit) {
          const message = `⚠️ Monthly budget exceeded for the time period of ${monthlyBudget.startDate.toISOString().split("T")[0]} to ${monthlyBudget.endDate.toISOString().split("T")[0]} ⚠️`;
          await createNotification(req.user, message, "spending");
          console.log(message);
        }
      }
    }

    res.status(201).json(transaction);
  }),

  // Get filtered transactions
  getFilteredTransactions: asyncHandler(async (req, res) => {
    const { startDate, endDate, type, category, tags } = req.query;
    let filters = { user: req.user };

    if (startDate) {
      filters.date = { ...filters.date, $gte: new Date(startDate) };
    }
    if (endDate) {
      filters.date = { ...filters.date, $lte: new Date(endDate) };
    }
    if (type) {
      filters.type = type;
    }
    if (category) {
      if (category === "All") {
        // No category filter needed when filtering for 'All'
      } else if (category === "Uncategorized") {
        filters.category = "Uncategorized";
      } else {
        filters.category = category;
      }
    }
    if (tags) {
      filters.tags = { $in: tags.split(",") };
    }

    const transactions = await Transaction.find(filters).sort({ date: -1 });
    res.json(transactions);
  }),

  // Update a transaction
  update: asyncHandler(async (req, res) => {
    console.log("Request Body:", req.body);
    const { type, category, amount, date, description, currency, tags, recurring } = req.body;

    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      let convertedAmount = transaction.amount;

      // If currency and amount are provided, convert the amount to the new currency
      if (currency && amount) {
        if (isNaN(amount)) {
          throw new Error("Amount must be a valid number");
        }
        convertedAmount = await convertCurrency(amount, "USD", currency); // Convert from USD to the new currency
      }

      transaction.type = req.body.type || transaction.type;
      transaction.category = req.body.category || transaction.category;
      transaction.amount = convertedAmount; // Use the converted amount
      transaction.currency = currency || transaction.currency; // Update the currency field
      transaction.date = req.body.date || transaction.date;
      transaction.description = req.body.description || transaction.description;
      transaction.tags = req.body.tags || transaction.tags;
      transaction.recurring = req.body.recurring || transaction.recurring;

      const updatedTransaction = await transaction.save();

      if (recurring && recurring.pattern) {
        await generateRecurringTransactions(updatedTransaction);
      }

      res.json(updatedTransaction);
    } else {
      throw new Error("Transaction not found or unauthorized");
    }
  }),

  // Delete a transaction
  delete: asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);
    if (transaction && transaction.user.toString() === req.user.toString()) {
      await Transaction.findByIdAndDelete(req.params.id);
      res.json({ message: "Transaction removed" });
    } else {
      throw new Error("Transaction not found or unauthorized");
    }
  }),
};

module.exports = transactionController;