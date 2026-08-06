import React, { useEffect, useRef, useState, useMemo } from "react";
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
import { Box, CircularProgress, Stack, Avatar } from "@mui/material";

function stringToColor(string) {
  if (!string) return "#25D366";
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}

const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

import io from "socket.io-client";
const ENDPOINT = BACKEND_BASE_URL;
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
  const [isSendingMessage, setIsMessageSending] = useState(false);
  
  const filePreviewUrl = useMemo(() => {
    if (selcetedFile) {
      return URL.createObjectURL(selcetedFile);
    }
    return null;
  }, [selcetedFile]);

  useEffect(() => {
    return () => {
      if (filePreviewUrl) URL.revokeObjectURL(filePreviewUrl);
    };
  }, [filePreviewUrl]);

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
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

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
    if (!selectedChat || !selectedChat.users) return "";
    let sender = selectedChat.users.filter((u) => {
      return u._id !== user._id;
    });
    return sender[0]?.name || "";
  };

  const getSenderImg = () => {
    if (!selectedChat || !selectedChat.users) return "";
    let sender = selectedChat.users.filter((u) => {
      return u._id !== user._id;
    });
    return sender[0]?.pic || "";
  };

  const getSenderId = () => {
    if (!selectedChat || !selectedChat.users) return "";
    let sender = selectedChat.users.filter((u) => {
      return u._id !== user._id;
    });
    return sender[0]?._id || "";
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      socket.emit("remove_online_user", user._id);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          fetchMessages();
        }
      } else {
        setMessages((prev) => [...prev, newMessageRecieved]);
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

    return () => {
      // cleanup listeners when component unmoun
      window.removeEventListener("beforeunload", handleBeforeUnload);
      socket.off("message recieved");
      socket.off("online_users");
      socket.off("update_online_users");
      socket.off("incoming_voice_call");
      socket.off("incoming_video_call");
      socket.off("voice_call_rejected");
      socket.off("video_call_rejected");
    };
  });


  const typingHandler = (e) => {
    setNewMessage(e.target.value);

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
        `${BACKEND_BASE_URL}/api/message/${selectedChat._id}`,
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
    
    // Clear notifications for the currently selected chat
    if (selectedChat && notification.length > 0) {
      const filteredNotifications = notification.filter(
        (n) => n.chat._id !== selectedChat._id
      );
      if (filteredNotifications.length !== notification.length) {
        setNotification(filteredNotifications);
        
        // Clear in backend
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        if (userInfo && userInfo.token) {
          axios.delete(`${BACKEND_BASE_URL}/api/notifications/${selectedChat._id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` }
          }).catch(err => console.error("Failed to clear backend notifications", err));
        }
      }
    }
  }, [selectedChat]);

  const sendMessage = async () => {
    if (
      (!selcetedFile || selcetedFile === null) &&
      (!newMessage || newMessage.trim() === "")
    ) {
      toast.info("Please enter a message or attach a file before sending!");
      return;
    }

    setIsMessageSending(true);
    socket.emit("stop typing", selectedChat._id);

    try {
      let content = newMessage ? newMessage : null;
      const { data } = await axios.post(
        `${BACKEND_BASE_URL}/api/message`,
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
    } finally {
      setIsMessageSending(false);
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
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, height: "100%", overflow: "hidden", width: "100%", boxSizing: "border-box" }}>
          <div
            style={{
              padding: "10px 1rem",
              backgroundColor: "#202c33",
              flexShrink: 0,
              height: "65px",
              boxSizing: "border-box",
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
                  {getSenderImg() ? (
                    <img
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                      src={getSenderImg()}
                      alt=""
                    />
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: stringToColor(selectedChat.chatName),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {selectedChat.chatName?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <p style={{ color: "white", margin: 0 }}>{selectedChat.chatName}</p>
                </div>

                <div style={{ display: "flex", gap: "10px", color: "white" }}>
                  {/* <CallIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleVoiceCall}
                  />
                  <VideocamIcon
                    style={{ cursor: "pointer" }}
                    onClick={handleVideoCall}
                  /> */}
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

                  {getSenderImg() ? (
                    <img
                      style={{
                        height: "40px",
                        width: "40px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                      src={getSenderImg()}
                      alt=""
                    />
                  ) : (
                    <Avatar
                      sx={{
                        bgcolor: stringToColor(getSenderName()),
                        width: 40,
                        height: 40,
                      }}
                    >
                      {getSenderName()?.charAt(0).toUpperCase()}
                    </Avatar>
                  )}
                  <div style={{ color: "white" }}>
                    <p style={{ margin: 0 }}>{getSenderName()}</p>
                    <p style={{ fontSize: "13px", color: "#8696a0", margin: 0 }}>
                      {onLineUsers[getSenderId()] ? "online" : "offline"}
                    </p>
                  </div>
                  {isTyping && (
                    <div className="typing-indicator" style={{ padding: 0, backgroundColor: "transparent" }}>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
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
                  {/* <span style={{ cursor: "pointer" }}>
                    <CallIcon onClick={handleVoiceCall} />
                  </span>
                  <span style={{ cursor: "pointer" }}>
                    <VideocamIcon onClick={handleVideoCall} />
                  </span> */}

                  <RemoveRedEyeIcon
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowSenderProfileModal(true)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* messages appear here */}
          <div
            id="messages"
            style={{
              height: "calc(100dvh - 130px)",
              overflowY: "auto",
              scrollbarWidth: "thin",
              scrollbarColor: "#ffffff40 #232323",
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
                  flexShrink: 0,
                  boxSizing: "border-box",
                  width: "100%",
                  height: "65px",
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
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    PaperProps={{
                      style: {
                        transform: "translateY(-25px)",
                        zIndex: 1300,
                      },
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
                    disabled={isSendingMessage}
                  >
                    {isSendingMessage ? (
                      <CircularProgress size={20} color="secondary" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
                <KeyboardVoiceIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowVoiceComponent(true)}
                />
              </div>
            )}
          {/* update group modal */}
          {/* <div ... /> */}
          {/* sender profile modal */}
          {/* <div ... /> */}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "20px",
            height: "100%",
            backgroundColor: "#0b141a",
            color: "white",
            textAlign: "center"
          }}
        >
          <div style={{
            background: "linear-gradient(135deg, rgba(37,211,102,0.1) 0%, rgba(37,211,102,0) 100%)",
            padding: "40px",
            borderRadius: "50%",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.2)",
            border: "1px solid rgba(255, 255, 255, 0.05)"
          }}>
            <img
              src={logo}
              style={{
                height: "120px",
                width: "120px",
                objectFit: "contain",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
              }}
              alt="Logo"
            />
          </div>
          <h2 style={{ fontWeight: 300, fontSize: "28px", margin: 0 }}>Talk-A-Tive for Web</h2>
          <p style={{ color: "#8696a0", maxWidth: "400px", lineHeight: "1.6" }}>
            Select a chat from the sidebar to start messaging, or create a new group to connect with multiple people at once.
          </p>
        </div>
      )}

      {/* File Modal */}
      <Dialog
        onClose={() => setShowFileModal(false)}
        aria-labelledby="customized-dialog-title"
        open={showFileModal}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          style: {
            backgroundColor: "#f0f2f5",
            borderRadius: "16px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: "#00a884", color: "white", fontWeight: "bold" }} id="customized-dialog-title">
          Preview File
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => setShowFileModal(false)}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            p: 4,
            minHeight: "400px",
            backgroundColor: "#e5ddd5",
            backgroundImage: "url('https://i.ibb.co/3mThcXc/chat-bg.png')",
            backgroundSize: "cover"
          }}
        >
          {selcetedFile && (
            <>
              {/*  Image */}
              {selcetedFile.type.startsWith("image/") && (
                <img
                  src={filePreviewUrl}
                  alt={selcetedFile.name}
                  style={{
                    borderRadius: "14px",
                    width: "100%",
                    maxWidth: "800px",
                    height: "auto",
                    objectFit: "contain",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  }}
                />
              )}

              {/*  Video */}
              {selcetedFile.type.startsWith("video/") && (
                <video
                  src={filePreviewUrl}
                  controls
                  style={{
                    borderRadius: "14px",
                    width: "100%",
                    maxWidth: "800px",
                    maxHeight: "500px",
                    objectFit: "contain",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                    backgroundColor: "#000",
                  }}
                />
              )}

              {/*  Audio */}
              {selcetedFile.type.startsWith("audio/") && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    borderRadius: "14px",
                    padding: "24px",
                    width: "100%",
                    maxWidth: "700px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                  }}
                >
                  <audio
                    src={filePreviewUrl}
                    controls
                    style={{
                      width: "100%",
                    }}
                  />
                  <p
                    style={{
                      marginTop: "12px",
                      color: "#555",
                      fontWeight: 500,
                    }}
                  >
                    🎵 {selcetedFile.name}
                  </p>
                </div>
              )}

              {/*  PDF */}
              {selcetedFile.type === "application/pdf" && (
                <embed
                  src={filePreviewUrl}
                  type="application/pdf"
                  width="100%"
                  height="600px"
                  style={{
                    borderRadius: "14px",
                    border: "1px solid #ddd",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                    backgroundColor: "#fff",
                  }}
                />
              )}

              {/*  ZIP */}
              {(selcetedFile.type === "application/zip" ||
                selcetedFile.type === "application/x-zip-compressed") && (
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      borderRadius: "14px",
                      backgroundColor: "#fff",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                      width: "100%",
                      maxWidth: "600px",
                    }}
                  >
                    <strong>{selcetedFile.name}</strong>
                    <p style={{ marginTop: "10px", color: "#555" }}>
                      ZIP file selected — preview not available.
                    </p>
                  </div>
                )}

              {/*  TXT */}
              {selcetedFile.type === "text/plain" && (
                <iframe
                  src={filePreviewUrl}
                  title={selcetedFile.name}
                  width="100%"
                  height="400px"
                  style={{
                    borderRadius: "14px",
                    border: "1px solid #ddd",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                    backgroundColor: "#fff",
                    maxWidth: "800px",
                  }}
                />
              )}

              {/*  Unsupported */}
              {!(
                selcetedFile.type.startsWith("image/") ||
                selcetedFile.type.startsWith("video/") ||
                selcetedFile.type.startsWith("audio/") ||
                selcetedFile.type === "application/pdf" ||
                selcetedFile.type === "application/zip" ||
                selcetedFile.type === "application/x-zip-compressed" ||
                selcetedFile.type === "text/plain"
              ) && (
                  <div
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      borderRadius: "14px",
                      backgroundColor: "#fff",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
                      width: "100%",
                      maxWidth: "600px",
                    }}
                  >
                    <strong>{selcetedFile.name}</strong>
                    <p style={{ marginTop: "10px", color: "#555" }}>
                      No preview available for this file type.
                    </p>
                  </div>
                )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ padding: "16px 24px", backgroundColor: "#f0f2f5" }}>
          <Button
            variant="contained"
            autoFocus
            onClick={sendMessage}
            disabled={isSendingMessage}
            sx={{
              backgroundColor: "#00a884",
              "&:hover": { backgroundColor: "#008f6f" },
              borderRadius: "24px",
              padding: "8px 24px",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "16px",
              boxShadow: "0 2px 10px rgba(0, 168, 132, 0.4)"
            }}
          >
            {isSendingMessage ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Send to " + (selectedChat?.isGroupChat ? selectedChat?.chatName : getSenderName())
            )}
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
