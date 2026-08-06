const Notification = require("../models/notification.model");
const ExpressError = require("../utils/ExpressError");

const fetchNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate({
        path: "message",
        populate: [
          { path: "sender", select: "name pic email" },
          { path: "chat" },
        ],
      })
      .sort({ createdAt: -1 });

    // The frontend expects an array of messages, so we extract the message object
    // and attach the notification ID if needed, but since it relies on the message
    // structure, we can just return the populated message.
    const unreadMessages = notifications
      .filter((n) => n.message) // Ensure message isn't deleted
      .map((n) => n.message);

    res.json(unreadMessages);
  } catch (error) {
    return next(new ExpressError(400, error.message));
  }
};

const clearChatNotifications = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return next(new ExpressError(400, "Invalid Chat Id"));
    }

    await Notification.deleteMany({ user: req.user._id, chat: chatId });

    res.json({ success: true, message: "Notifications cleared for this chat" });
  } catch (error) {
    return next(new ExpressError(400, error.message));
  }
};

module.exports = { fetchNotifications, clearChatNotifications };
