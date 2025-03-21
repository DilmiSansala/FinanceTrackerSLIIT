// routes/notificationRoutes.js
const express = require("express");
const notificationController = require("../controllers/notificationCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const notificationRouter = express.Router()

notificationRouter.get("/api/v1/notifications/fetch-notification", isAuthenticated, notificationController.fetch);
notificationRouter.get("/api/v1/notifications/mark-read/:id", isAuthenticated, notificationController.markAsRead);
notificationRouter.delete("/api/v1/notifications/delete/:id", isAuthenticated, notificationController.deleteNotification); 
  

module.exports = notificationRouter;
