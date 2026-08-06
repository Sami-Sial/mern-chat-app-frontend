const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/middleware");
const { fetchNotifications, clearChatNotifications } = require("../controllers/notification.controllers");

router.get("/", isLoggedIn, fetchNotifications);
router.delete("/:chatId", isLoggedIn, clearChatNotifications);

module.exports = router;
