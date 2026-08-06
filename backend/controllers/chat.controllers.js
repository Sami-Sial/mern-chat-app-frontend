const chats = require("../data");
const Chat = require("../models/chat.model");
const User = require("../models/user.model");
const Message = require("../models/message.model");
const Notification = require("../models/notification.model");

const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("userId param not sent with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMsg");

  isChat = await User.populate(isChat, {
    path: "latestMessage",
    selcet: "name, pic, email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = new Chat(chatData);
      await createdChat.save();
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
};

// const fetchChats = (req, res) => {
//    try {
//      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
//         .populate("users", "-password")
//         .populate("groupAdmin", "password")
//         .populate("latestMsg")
//         .sort({ updatedAt: -1 })
//         .then(async (results) => {
//             results = await User.populate(results, {
//                 path: "latestMessage.sender",
//                 select: "name pic email",
//             })
//             res.status(200).send(results);
//     })
//     } catch (error) {
//        res.status(400).send(error.message);
//     }
// }

const fetchChats = async (req, res) => {
  req.query.searchKeyword;
  try {
    const results = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "password")
      .populate("latestMsg")
      .sort({ updatedAt: -1 });

    res.status(200).send(results);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createGroupChat = async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    res.status(400).send({ message: "Please fill all the fields" });
  }

  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user);

  try {
    const groupChatData = new Chat({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
      groupPic: req.file && req.file.path,
    });
    const groupChat = await groupChatData.save();

    // Create system message
    const sysMsg = await Message.create({
      sender: req.user._id,
      chat: groupChat._id,
      content: `${req.user.name} created the group.`,
      msgType: "info",
    });

    await Chat.findByIdAndUpdate(groupChat._id, { latestMsg: sysMsg });

    // Create notifications for all added users except the admin
    const notificationsToInsert = users
      .filter((u) => {
        const id = u._id || u;
        return id.toString() !== req.user._id.toString();
      })
      .map((u) => ({
        user: u._id || u,
        chat: groupChat._id,
        message: sysMsg._id,
      }));

    if (notificationsToInsert.length > 0) {
      await Notification.insertMany(notificationsToInsert);
    }

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMsg");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(400).sned("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
};

const addToGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400).sned("Chat Not Found");
  } else {
    // Create system message
    const addedUser = await User.findById(userId);
    const sysMsg = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content: `${req.user.name} added ${addedUser.name}.`,
      msgType: "info",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMsg: sysMsg });

    // Create notification for the newly added user
    await Notification.create({
      user: userId,
      chat: chatId,
      message: sysMsg._id,
    });

    // Populate latestMsg to send back
    const finalChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMsg");

    res.json(finalChat);
  }
};

const removeFromGroup = async (req, res) => {
  const { userId, chatId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(400).send("Chat Not Found");
  } else {
    // Determine the content based on who is removing whom
    let msgContent = "";
    if (req.user._id.toString() === userId.toString()) {
      msgContent = `${req.user.name} left the group.`;
    } else {
      const removedUser = await User.findById(userId);
      msgContent = `${req.user.name} removed ${removedUser ? removedUser.name : "a user"}.`;
    }

    // Create system message
    const sysMsg = await Message.create({
      sender: req.user._id,
      chat: chatId,
      content: msgContent,
      msgType: "info",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMsg: sysMsg });

    const finalChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMsg");

    res.json(finalChat);
  }
};

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
