// controllers/notificationCtrl.js
const asyncHandler = require("express-async-handler");
const Notification = require("../model/Notification");

const notificationController = {
  // Fetch all notifications for a user
  fetch: asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user }).sort({ date: -1 });
    res.status(200).json(notifications);
  }),

  // Mark a notification as read
  markAsRead: asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);
    if (notification && notification.user.toString() === req.user.toString()) {
      notification.read = true;
      await notification.save();
      res.json(notification);
    } else {
      throw new Error("Notification not found or unauthorized");
    }
  }),
  //!=============Delete notification ==================//
  deleteNotification: asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      throw new Error("Notification not fount");
    }

    if (notification.user.toString() !== req.user.toString()) {
      throw new Error("Unauthorized access");
    }

    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: "Notification deleted successfully" });
  }),
};

module.exports = notificationController;