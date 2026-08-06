const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User",
      required: true
    },
    chat: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Chat",
      required: true
    },
    message: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Message",
      required: true
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
