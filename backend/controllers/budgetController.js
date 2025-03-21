const asyncHandler = require("express-async-handler");
const Budget = require("../model/Budget");

const BudgetController = {
  //!Create budget

  create: asyncHandler(async (req, res) => {
    //Get all the details from the user input
    const { type, category, limit, startDate, endDate } = req.body;
    let { currentSpending } = req.body;

    //Validate all the fields
    if (!type || !limit || !startDate || !endDate) {
      throw new Error("All fields must required to crete a budget");
    }
    if (!currentSpending) {
      currentSpending = 0; //assign 0 for the currentSpending property if user did not provide any
    }

    //Create a bew budget
    const budget = await Budget.create({
      user: req.user,
      type,
      category,
      limit,
      currentSpending,
      startDate,
      endDate,
    });
    res.status(200).json(budget);
  }),

  //!Fetch budgets
  fetch: asyncHandler(async (req, res) => {
    const budget = await Budget.find({ user: req.user });
    res.status(200).json(budget);
  }),
  //!Update budget

  update: asyncHandler(async (req, res) => {
    //get the budget Id using params
    const { budgetId } = req.params;
    const { type, category, limit, currentSpending, startDate, endDate } =
      req.body; //Get the user inputs through req object

    const budget = await Budget.findById(budgetId); //find the budget that need to be update

    if (!budget && budget.user.toString() !== req.user.toString()) {
      //validate
      throw new Error("Budget not found or user not authorized");
    }

    //update the budget properties
    budget.type = type || budget.type;
    budget.category = category || budget.category;
    budget.limit = limit || budget.limit;
    budget.startDate = startDate || budget.startDate;
    budget.endDate = endDate || budget.endDate;
    budget.currentSpending = currentSpending || budget.currentSpending;

    const updatedBudget = await budget.save();

    res.json(updatedBudget);
  }),

  //!Remove budget
  delete: asyncHandler(async (req, res) => {
    const budget = await Budget.findById(req.params.id); //get the budget by id

    //validate
    if (budget && budget.user.toString() === req.user.toString()) {
      await Budget.findByIdAndDelete(req.params.id); //delete or removed the particular budget from the database
      res.json({ message: "Budget has been removed successfully" }); //display the successful message
    } else {
      res
        .status(400)
        .json({ message: "Budget not found or user not authorized" });
    }
  }),
};
module.exports = BudgetController;
