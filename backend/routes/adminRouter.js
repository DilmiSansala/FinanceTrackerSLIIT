const express = require("express");
const isAdminAuthenticated = require("../middlewares/isAdminAuth");
const adminController = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.post("/api/v1/admin/register", adminController.register);
adminRouter.post("/api/v1/admin/login", adminController.login);
adminRouter.get(
  "/api/v1/admin/profile",
  isAdminAuthenticated,
  adminController.profile
);
adminRouter.put(
  "/api/v1/admin/change-password",
  isAdminAuthenticated,
  adminController.changeAdminPassword
);
adminRouter.put(
  "/api/v1/admin/update-profile",
  isAdminAuthenticated,
  adminController.updateAdminProfile
);
module.exports = adminRouter;
 