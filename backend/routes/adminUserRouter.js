const express = require("express");
//!Imported the user controller file
const adminUserController = require("../controllers/adminUserController");
const isAdminAuthenticated = require("../middlewares/isAdminAuth");

const adminUserRouter = express.Router();

adminUserRouter.post(
  "/api/v1/admin-users/register",
  adminUserController.register
); //!Register

adminUserRouter.get(
  "/api/v1/admin-users/fetch",
  isAdminAuthenticated,
  adminUserController.fetch
); //!fetch all the users
adminUserRouter.get(
  "/api/v1/admin-users/profile/:id",
  isAdminAuthenticated,
  adminUserController.profile
); //!Profile
adminUserRouter.put(
  "/api/v1/admin-users/change-password/:id",
  isAdminAuthenticated,
  adminUserController.changeUserPassword
); //! change password
adminUserRouter.put(
  "/api/v1/admin-users/update-profile/:id",
  isAdminAuthenticated,
  adminUserController.updateUserProfile
); //! Update profile
adminUserRouter.delete(
  "/api/v1/admin-users/delete-account/:id",
  isAdminAuthenticated,
  adminUserController.delete
); //!Delete Profile
module.exports = adminUserRouter;
