import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import UpdateGroupModal from "./modals/UpdateGroupModal";
import SenderProfileModal from "./modals/SenderProfileModal";
import ScrollableChat from "./ScrollableChat.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import logo from "../../assets/logo.png";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import Button from "@mui/material/Button";
import CollectionsIcon from "@mui/icons-material/Collections";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import ScrollToBottom from "react-scroll-to-bottom";
import AudioComponent from "./AudioComponent";
import EmojiPicker from "emoji-picker-react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import TextField from "@mui/material/TextField";
import { Box, Stack } from "@mui/material";

import io from "socket.io-client";
const ENDPOINT = "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app";
let socket, selectedChatCompare;

const Main = () => {
  const messagesEndRef = useRef();
  const [showVoiceComponent, setShowVoiceComponent] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isReciverOnline, setIsReciverOnline] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [showSenderProfileModal, setShowSenderProfileModal] = useState(false);
  const [showUpdateGroupModal, setShowUpdateGroupModal] = useState(false);
  const [selcetedFile, setSelectedFile] = useState(null);
  const [onLineUsers, setOnLineUSers] = useState({});
  const {
    notification,
    setNotification,
    user,
    selectedChat,
    setSelectedChat,
    setVideoCall,
    setVoiceCall,
    setIncomingVoiceCall,
    setIncomingVideoCall,
  } = ChatState();
  const { token } = JSON.parse(localStorage.getItem("userInfo"));

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleEmojiPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleEmojiClose = () => {
    setAnchorEl(null);
  };
  const handleEmojiClick = (emoji) => {
    setNewMessage((prevMsg) => (prevMsg += emoji.emoji));
  };
  const emojiPopoverOpen = Boolean(anchorEl);
  const emojiPopoverId = open ? "simple-popover" : undefined;

  const openFilePicker = async () => {
    const [fileHandle] = await window.showOpenFilePicker();

    const fileData = await fileHandle.getFile();
    setSelectedFile(fileData);
    setShowFileModal(true);
    console.log(fileData, selcetedFile);
  };

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"], // Force WebSocket only
    });
    console.log(navigator.onLine);

    if (window.navigator.onLine) {
      socket.emit("add_online_user", user._id);
    }
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const getSenderName = () => {
    let sender = selectedChat.users.filter((u) => {
      return u._id !== user._id;
    });
    return sender[0].name;
  };

  const getSenderImg = () => {
    let sender = selectedChat.users.filter((u) => {
      return u._id !== user._id;
    });
    return sender[0].pic;
  };

  const getSenderId = () => {
    let sender = selectedChat.users.filter((u) => {
      return u._id !== user._id;
    });
    return sender[0]._id;
  };

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      socket.emit("remove_online_user", user._id);
    });

    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          fetchMessages();
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });

    socket.on("online_users", (onLineusers) => {
      console.log(onLineusers);
      setOnLineUSers(onLineusers);
    });

    socket.on("update_online_users", (onLineusers) => {
      console.log(onLineusers);
      setOnLineUSers(onLineusers);
    });

    socket.on("incoming_voice_call", ({ from, roomId, callType }) => {
      setIncomingVoiceCall({
        ...from,
        roomId,
        callType,
      });
    });

    socket.on("incoming_video_call", ({ from, roomId, callType }) => {
      setIncomingVideoCall({
        ...from,
        roomId,
        callType,
      });
    });

    socket.on("voice_call_rejected", () => {
      setVoiceCall(undefined);
      setIncomingVoiceCall(undefined);
    });

    socket.on("video_call_rejected", () => {
      setVideoCall(undefined);
      setIncomingVideoCall(undefined);
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const fetchMessages = async () => {
    try {
      if (!selectedChat) return;
      const { data } = await axios.get(
        `https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/message/${selectedChat._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages(data);
      console.log(data);

      socket.emit("join chat", selectedChat._id);
      let sender = selectedChat.users.filter((u) => {
        return u._id !== user._id;
      });
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  const sendMessage = async () => {
    socket.emit("stop typing", selectedChat._id);

    try {
      let content = newMessage ? newMessage : null;
      const { data } = await axios.post(
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/message",
        { content, selcetedFile, chatId: selectedChat._id },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data);

      socket.emit("new message", data);

      setMessages([...messages, data]);
      setSelectedFile(null);
      setShowFileModal(false);
      setNewMessage("");
    } catch (error) {
      toast.error(error.response.data);
      console.log(error);
    }
  };

  const handleVideoCall = () => {
    setVideoCall({
      type: "out_going",
      callType: "video",
      roomId: selectedChat._id,
    });
  };

  const handleVoiceCall = () => {
    setVoiceCall({
      type: "out_going",
      callType: "voice",
      roomId: selectedChat._id,
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  return (
    <>
      {selectedChat ? (
        <>
          <div
            style={{
              padding: "5px 1rem",
            }}
          >
            {selectedChat.isGroupChat ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <KeyboardBackspaceIcon
                    fontSize="large"
                    sx={{
                      color: "white",
                      marginRight: "10px",
                      cursor: "pointer",
                      display: "none",
                      "@media (max-width:700px)": { display: "inline" },
                    }}
                    onClick={() => setSelectedChat(null)}
                  />
                  <img
                    onClick={() => setShowUpdateGroupModal(true)}
                    style={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    src={getSenderImg()}
                    alt=""
                  />
                  <p>{selectedChat.chatName}</p>
                </div>

                <div style={{ display: "flex", gap: "10px", color: "white" }}>
                  <CallIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleVoiceCall}
                  />
                  <VideocamIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleVideoCall}
                  />
                  <RemoveRedEyeIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowUpdateGroupModal(true)}
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  <KeyboardBackspaceIcon
                    fontSize="large"
                    sx={{
                      color: "white",
                      marginRight: "10px",
                      cursor: "pointer",
                      display: "none",
                      "@media (max-width:700px)": { display: "inline" },
                    }}
                    onClick={() => setSelectedChat(null)}
                  />

                  <img
                    onClick={() => setShowSenderProfileModal(true)}
                    style={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                    }}
                    src={getSenderImg()}
                    alt=""
                  />
                  <div>
                    <p>{getSenderName()}</p>
                    <p style={{ fontSize: "13px" }}>
                      {onLineUsers[getSenderId()] ? "online" : "offline"}
                    </p>
                  </div>
                  {isTyping ? (
                    <p style={{ fontSize: "11px" }}>(typing...)</p>
                  ) : (
                    <></>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "white",
                  }}
                >
                  <CallIcon onClick={handleVideoCall} />
                  <VideocamIcon onClick={handleVoiceCall} />

                  <RemoveRedEyeIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowSenderProfileModal(true)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* messages appear here */}
          <div>
            <div
              id="messages"
              style={{
                maxHeight: "calc(100vh - 6.2rem)",
                minHeight: "calc(100vh - 6.2rem)",
                overflow: "auto",
                scrollbarWidth: "thin",
                scrollbarColor: "white #232323",
                backgroundColor: "#0b141a",
              }}
            >
              <ScrollableChat messages={messages} />
              <div ref={messagesEndRef} />
            </div>

            {showVoiceComponent ? (
              <div>
                <AudioComponent
                  setShowVoiceComponent={setShowVoiceComponent}
                  messages={messages}
                  setMessages={setMessages}
                  socket={socket}
                  setSelectedFile={setSelectedFile}
                  selcetedFile={selcetedFile}
                />
              </div>
            ) : (
              <div
                style={{
                  padding: "10px",
                  backgroundColor: "#202c33",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  color: "white",
                }}
              >
                <div>
                  <EmojiEmotionsIcon
                    style={{ cursor: "pointer" }}
                    aria-describedby={emojiPopoverId}
                    onClick={handleEmojiPopover}
                  />
                  <Popover
                    id={emojiPopoverId}
                    open={emojiPopoverOpen}
                    anchorEl={anchorEl}
                    onClose={handleEmojiClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <div>
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  </Popover>
                </div>
                <AttachFileIcon
                  onClick={openFilePicker}
                  style={{ cursor: "pointer" }}
                />
                <div>
                  <Box
                    component="input"
                    sx={{
                      width: "300px",
                      marginRight: "10px",
                      color: "white",
                      padding: "7px 10px",
                      border: "none",
                      backgroundColor: "#111b21",
                      borderRadius: "25px",
                      "@media (max-width:520px)": { width: "65%" },
                    }}
                    type="text"
                    value={newMessage}
                    onChange={(e) => typingHandler(e)}
                    required
                  />
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: "#111b21",
                      padding: "2px",
                    }}
                    onClick={sendMessage}
                  >
                    Send
                  </Button>
                </div>
                <KeyboardVoiceIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowVoiceComponent(true)}
                />
              </div>
            )}
          </div>

          {/* update group modal */}
          {/* <div
            style={{
              display: updateGroupModalShow ? "block" : "none",
              backgroundColor: "lightgray",
            }}
          >
            <UpdateGroupModal />
          </div> */}

          {/* sender profile modal */}
          {/* <div
            className="profile-modal"
            style={{
              display: senderModalShow ? "block" : "none",
              backgroundColor: "lightgray",
            }}
          >
            <SenderProfileModal />
          </div> */}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "10px",
            height: "100vh",
          }}
        >
          <img
            src={logo}
            style={{
              height: "100px",
              width: "100px",
              mixBlendMode: "multiply",
            }}
            alt=""
          />
          <p>Click on a user to start chat</p>
        </div>
      )}

      {/* File Modal */}
      <Dialog
        onClose={() => setShowFileModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showFileModal}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          File
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setShowFileModal(false)}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <img
            src={selcetedFile && window.URL.createObjectURL(selcetedFile)}
            style={{ borderRadius: "10px" }}
            width={350}
            height={250}
            alt=""
          />
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            autoFocus
            onClick={sendMessage}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      {/* sender profile modal */}
      <Dialog
        onClose={() => setShowSenderProfileModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showSenderProfileModal}
      >
        <SenderProfileModal
          setShowSenderProfileModal={setShowSenderProfileModal}
        />
      </Dialog>

      {/* update grouup profile modal */}
      <Dialog
        onClose={() => setShowUpdateGroupModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showUpdateGroupModal}
      >
        <UpdateGroupModal setShowUpdateGroupModal={setShowUpdateGroupModal} />
      </Dialog>
    </>
  );
};

export default Main;
