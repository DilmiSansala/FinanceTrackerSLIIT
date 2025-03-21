const express = require("express");
const BudgetController = require("../controllers/budgetController");
const isAuthenticated = require("../middlewares/isAuth");

const budgetRouter = express.Router();

budgetRouter.post(
  "/api/v1/budget/create",
  isAuthenticated,
  BudgetController.create
);
budgetRouter.get(
  "/api/v1/budget/fetch",
  isAuthenticated,
  BudgetController.fetch
);
budgetRouter.put(
  "/api/v1/budget/update/:budgetId",
  isAuthenticated,
  BudgetController.update
);
budgetRouter.delete(
  "/api/v1/budget/delete/:id",
  isAuthenticated,
  BudgetController.delete
);

module.exports = budgetRouter;
