import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import "./stylesheets/myChats.css";
import { ChatState } from "../../context/ChatProvider";
import GroupChatModal from "./modals/GroupChatModal";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Drawer from "@mui/material/Drawer";
import SideDrawer from "./SideDrawer";
import Popover from "@mui/material/Popover";
import ImageIcon from "@mui/icons-material/Image";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArchiveIcon from "@mui/icons-material/Archive";
import ProfileModal from "./modals/ProfileModal";
import { useNavigate } from "react-router-dom";
import ChatLoading from "./ChatLoading"; // Skeleton component
import LogoutIcon from "@mui/icons-material/Logout";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { CircularProgress } from "@mui/material";

const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const MyChats = () => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [profileModalShow, setProfileModalShow] = useState(false);
  const [openDrawer, setOpenDrwer] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [loading, setLoading] = useState(true); // Loading for first fetch
  const [searchLoading, setSearchLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredChats, setFilteredChats] = useState([]);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const {
    chats,
    setChats,
    selectedChat,
    user,
    setSelectedChat,
    notification,
    setUser,
  } = ChatState();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const loggedUser = user;

  // Debounce function
  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const filterChats = (keyword) => {
    if (!keyword) {
      setFilteredChats(chats);
      return;
    }
    const lower = keyword.toLowerCase();
    const results = chats.filter((c) => {
      const name = !c.isGroupChat ? getSenderName(c.users) : c.chatName;
      return name?.toLowerCase().includes(lower);
    });
    setFilteredChats(results);
  };

  const handleSearch = debounce((value) => {
    setSearchLoading(true);
    filterChats(value);
    setTimeout(() => setSearchLoading(false), 300);
  }, 400);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const openPop = Boolean(anchorEl);
  const popId = openPop ? "simple-popover" : undefined;

  const toggleDrawer = (newOpen) => () => setOpenDrwer(newOpen);

  const getSenderName = (users) =>
    users[0]._id === loggedUser._id ? users[1].name : users[0].name;
  const getSenderPic = (users) =>
    users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
  const getSenderId = (users) =>
    users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
  const getNotif = (users) => {
    const notif = notification?.filter(
      (n) => n.sender._id === getSenderId(users)
    );
    return notif?.length || 0;
  };

  function checkDateStatus(dateString) {
    const givenDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (givenDate.toDateString() === today.toDateString()) {
      return dateString.slice(12); // show time
    } else if (givenDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return dateString.slice(0, 11); // show date
    }
  }

  const fetchChats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BACKEND_BASE_URL}/api/chats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);

      setChats(data);
    } catch (error) {
      toast.error(error.response?.data || "Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLogoutLoading(true);

    setTimeout(() => {
      localStorage.removeItem("userInfo");
      setUser(null);
      toast.success("Logout seucessfully");
      navigate("/");
    }, 2000);
  };

  const handleCreateNewChat = () => {
    setOpenDrwer(true);
    handleClose();
  };

  const handleCreateNewGroup = () => {
    setModalShow(true);
    handleClose();
  };

  const handleViewProfile = () => {
    setProfileModalShow(true);
    handleClose();
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    setFilteredChats(chats);
  }, [chats]);

  const getLatestMessagePreview = (msg) => {
    if (!msg) return "";
    switch (msg.msgType) {
      case "text":
        return msg.content?.length > 25
          ? msg.content?.slice(0, 25) + "..."
          : msg.content;
      case "Image":
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ImageIcon sx={{ fontSize: 16, color: "white", opacity: 0.6 }} />{" "}
            <span>Image</span>
          </span>
        );
      case "Video":
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <VideoFileIcon
              sx={{ fontSize: 16, color: "white", opacity: 0.6 }}
            />{" "}
            <span>Video</span>
          </span>
        );
      case "Audio":
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <AudiotrackIcon
              sx={{ fontSize: 16, color: "white", opacity: 0.6 }}
            />{" "}
            <span>Audio</span>
          </span>
        );
      case "PDF":
      case "TextFile":
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <InsertDriveFileIcon
              sx={{ fontSize: 16, color: "white", opacity: 0.6 }}
            />{" "}
            <span>Document</span>
          </span>
        );
      case "ZIP":
        return (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <ArchiveIcon sx={{ fontSize: 16, color: "white", opacity: 0.6 }} />{" "}
            <span>ZIP</span>
          </span>
        );
      default:
        return "Unsupported File";
    }
  };

  return (
    <>
      <div id="chats-sidebar">
        {/* Top Panel */}
        <div
          style={{
            backgroundColor: "#202c33",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <img
              onClick={() => setProfileModalShow(true)}
              src={user?.pic}
              title="View Profile"
              height={36} // slightly smaller
              width={36}
              alt={user?.name || "Profile"}
              style={{
                borderRadius: "50%", // rounded
                cursor: "pointer",
                border: "2px solid #202c33",
                boxShadow:
                  "0 6px 18px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
                transition: "transform .15s ease, box-shadow .15s ease",
                objectFit: "cover",
              }}
            />
            <p>{user?.name}</p>
          </div>

          <span>
            <MoreVertIcon
              aria-describedby={popId}
              titleAccess="Menu"
              onClick={handleClick}
              style={{ cursor: "pointer", color: "white" }}
            />
            <Popover
              id={popId}
              open={openPop}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <div style={{ width: "200px", padding: "10px" }}>
                <div
                  onClick={handleCreateNewChat}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <PersonAddIcon fontSize="small" />
                  <span>Create New Chat</span>
                </div>
                <div
                  onClick={handleCreateNewGroup}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <GroupAddIcon fontSize="small" />
                  <span>Create New Group</span>
                </div>
                <div
                  onClick={handleViewProfile}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  <ChatIcon fontSize="small" />
                  <span>View Profile</span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 12px",
                    cursor: "pointer",
                    border: "none",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  disabled={logoutLoading}
                >
                  {logoutLoading ? (
                    <>
                      <CircularProgress size={20} />{" "}
                      <p style={{ color: "black" }}>Logging out..</p>
                    </>
                  ) : (
                    <>
                      <LogoutIcon fontSize="small" />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>
            </Popover>
          </span>
        </div>

        {/* Search Inpu */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 7px",
            gap: "5px",
          }}
        >
          <input
            style={{
              backgroundColor: "#202c33",
              padding: "10px",
              borderRadius: "15px",
              border: "none",
              width: "100%",
              color: "white",
            }}
            onChange={(e) => {
              setSearch(e.target.value);
              handleSearch(e.target.value);
            }}
            type="text"
            placeholder="Search chat"
          />
        </div>

        {/* Chats List */}
        <div id="chats" style={{ overflowY: "auto", minHeight: "300px" }}>
          {loading || searchLoading ? (
            <ChatLoading />
          ) : filteredChats?.length >= 1 ? (
            filteredChats.map((chat) => (
              <div
                onClick={() => setSelectedChat(chat)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "5px",
                  marginBottom: "12px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedChat?._id === chat?._id ? "#2a3942" : "",
                  border:
                    selectedChat?._id === chat?._id
                      ? ""
                      : "0.5px solid #2a3942",
                  transition: "background 0.2s ease",
                }}
                className="chats"
              >
                <img
                  src={
                    !chat.isGroupChat ? getSenderPic(chat.users) : chat.groupPic
                  }
                  style={{
                    borderRadius: "50%",
                    marginRight: "5px",
                    cursor: "pointer",
                    border: "1px solid #202c33",
                    boxShadow:
                      "0 6px 18px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
                    transition: "transform .15s ease, box-shadow .15s ease",
                    objectFit: "cover",
                  }}
                  width={40}
                  height={40}
                  alt=""
                />
                <div style={{ flexGrow: "1", padding: "5px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <p style={{ color: "white" }}>
                      {!chat.isGroupChat
                        ? getSenderName(chat.users)
                        : chat.chatName}
                    </p>
                    {chat.latestMsg && (
                      <p style={{ fontSize: "10px", color: "white" }}>
                        {checkDateStatus(
                          new Date(chat.latestMsg.createdAt).toLocaleString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }
                          )
                        )}
                      </p>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "white",
                        opacity: 0.8,
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        maxWidth: "150px",
                      }}
                    >
                      {getLatestMessagePreview(chat.latestMsg)}
                    </div>
                    {getNotif(chat.users) > 0 && (
                      <div
                        style={{
                          minWidth: "20px",
                          padding: "2px 6px",
                          backgroundColor: "#25D366",
                          borderRadius: "50px",
                          color: "white",
                          fontSize: "12px",
                          fontWeight: "600",
                          textAlign: "center",
                          marginLeft: "8px",
                        }}
                      >
                        {getNotif(chat.users)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                color: "white",
              }}
            >
              <p>No chats found</p>
              <Button
                variant="contained"
                onClick={() => setOpenDrwer(true)}
                style={{ marginTop: "10px", backgroundColor: "#202c33" }}
              >
                Create Chat
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Dialog open={modalShow} onClose={() => setModalShow(false)}>
        <GroupChatModal modalShow={{ modalShow, setModalShow }} />
      </Dialog>

      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        <SideDrawer setOpenDrwer={setOpenDrwer} />
      </Drawer>

      <Dialog
        open={profileModalShow}
        onClose={() => setProfileModalShow(false)}
      >
        <ProfileModal setProfileModalShow={setProfileModalShow} />
      </Dialog>
    </>
  );
};

export default MyChats;
