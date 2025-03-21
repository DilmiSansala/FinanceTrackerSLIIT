const express = require("express");
const goalController = require("../controllers/goalCtrl");
const isAuthenticated = require("../middlewares/isAuth");
const goalRouter = express.Router();

goalRouter.post("/api/v1/goals/create", isAuthenticated, goalController.create);
goalRouter.get("/api/v1/goals/lists", isAuthenticated, goalController.lists);
goalRouter.put("/api/v1/goals/update-saved-amount", isAuthenticated, goalController.updateSavedAmount);
goalRouter.post("/api/v1/goals/allocate-savings", isAuthenticated, goalController.allocateSavings);

module.exports = goalRouter;