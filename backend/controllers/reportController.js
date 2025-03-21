const asyncHandler = require("express-async-handler");
const Report = require("../model/Report");
const Transaction = require("../model/Transaction");

//! =============Helper function to generate spending report ===============//
const generateSpendingTrends = (transactions) => {


  const spendingByCategory = {};
  const spendingByDay = {};

  transactions.forEach((transaction) => {
    if (transaction.type === "expense") {
      //spending by category
      if (!spendingByCategory[transaction.category]) {
        spendingByCategory[transaction.category] = 0;
      }
      spendingByCategory[transaction.category] += transaction.amount;
      console.log(spendingByCategory);

      //Spending by day
      const date = transaction.date.toISOString().split("T")[0];
      if (!spendingByDay[date]) {
        spendingByDay[date] = 0;
      }
      spendingByDay[date] += transaction.amount;
    }
  });

  return { spendingByCategory, spendingByDay };
};

//! =============Helper function to generate income report ===============//
const generateIncomeTrends = (transactions) => {

  const incomeByCategory = {};
  const incomeByDay = {};

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      //Income by category
      if (!incomeByCategory[transaction.category]) {
        incomeByCategory[transaction.category] = 0;
      }
      incomeByCategory[transaction.category] += transaction.amount;

      //Income by date
      const day = transaction.date.toISOString().split("T")[0];

      if (!incomeByDay[day]) {
        incomeByDay[day] = 0;
      }
      incomeByDay[day] += transaction.amount;
    }
  });

  return { incomeByCategory, incomeByDay };
};

//! =============Helper function to generate income report ===============//
const generateIncomeVsExpense = (transactions) => {
  console.log("Sample income expense");
  const income = { total: 0, byCategory: {} };
  const expenses = { total: 0, byCategory: {} };

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      income.total += transaction.amount;
      if (!income.byCategory[transaction.category]) {
        income.byCategory[transaction.category] = 0;
      }
      income.byCategory[transaction.category] += transaction.amount;
    } else if (transaction.type === "expense") {
      expenses.total += transaction.amount;
      if (!expenses.byCategory[transaction.category]) {
        expenses.byCategory[transaction.category] = 0;
      }
      expenses.byCategory[transaction.category] += transaction.amount;
    }
  });

  return { income, expenses };
};

const reportController = {
  //! ===========Generate financial report===================//
  financialReport: asyncHandler(async (req, res) => {
    const { type, period, filters } = req.body;

    if (!type || !period || !filters) {
      throw new Error(
        "Please filed the type, period and filter can not be empty"
      );
    }

    //Fetch the transaction based on filter
    const query = {
      user: req.user,
      date: { $gte: new Date(`${period}-01`), $lt: new Date(`${period}-31`) },
    };
  //  console.log(query);

    //*------Add category and tags filters to the query if they exist in the filters object-----
    if (filters?.category) query.category = filters.category;
    if (filters?.tags) query.tags = { $in: filters.tags };

    //*---Find the transaction based on the query----
    const transactions = await Transaction.find(
        query
    );

    if (!transactions) {
      throw new Error("Transactions are not available");
    }

    //* ----Generate the report based on type ---
    let data;
    if (type === "expense") {
      data = generateSpendingTrends(transactions);
    } else if (type === "income") {
      data = generateIncomeTrends(transactions);
    } else if (type === "income-vs-expense") {
      data = generateIncomeVsExpense(transactions);
    }

    //*---Create the report---
    const report = new Report({ user: req.user, type, period, data, filters });
    await report.save();

    res.status(200).json(report);
  }),

  //! ===========Fetch All reports===================//
  fetch: asyncHandler(async (req, res) => {
    const reports = await Report.find({ user: req.user });

    res.json(reports);
  }),
};
module.exports = reportController;
