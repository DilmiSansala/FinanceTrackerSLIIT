const express = require("express");
const reportController = require("../controllers/reportController");
const isAuthenticated = require("../middlewares/isAuth");

const reportRouter = express.Router();

//! --create a report --
reportRouter.post(
  "/api/v1/reports/create-report",
  isAuthenticated,
  reportController.financialReport
);

//! --Fetch all reports --
reportRouter.get(
  "/api/v1/reports/get-reports",
  isAuthenticated,
  reportController.fetch
);

module.exports = reportRouter;
