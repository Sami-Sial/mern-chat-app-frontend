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
import logo from "../../assets/logo.png";
import Drawer from "@mui/material/Drawer";
import SideDrawer from "./SideDrawer";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./modals/ProfileModal";

const MyChats = () => {
  const navigate = useNavigate();
  const [modalShow, setModalShow] = useState(false);
  const [profileModalShow, setProfileModalShow] = useState(false);
  const [openDrawer, setOpenDrwer] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const toggleDrawer = (newOpen) => () => {
    setOpenDrwer(newOpen);
  };

  let {
    chats,
    setChats,
    selectedChat,
    user,
    setUser,
    setSelectedChat,
    notification,
    setNotification,
  } = ChatState();
  const { token } = JSON.parse(localStorage.getItem("userInfo"));

  let loggedUser = user;
  const getSenderName = (users) => {
    if (users) {
      return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    }
  };

  const getSenderPic = (users) => {
    if (users) {
      return users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
    }
  };

  const getSenderId = (users) => {
    if (users) {
      return users[0]._id === loggedUser._id ? users[1]._id : users[0]._id;
    }
  };

  const getNotif = (users) => {
    const notif = notification?.filter(
      (n) => n.sender._id == getSenderId(users)
    );
    if (notif?.length >= 1) {
      return notif.length;
    }
  };

  console.log(notification);

  const searchExistingChat = (searchKeyword) => {
    console.log(searchKeyword);

    fetchChats(searchKeyword);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  function checkDateStatus(dateString) {
    const givenDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1); // Get yesterday's date

    if (givenDate.toDateString() === today.toDateString()) {
      return dateString.slice(12, dateString.length);
    } else if (givenDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return dateString.slice(0, 11);
    }
  }

  const fetchChats = async (searchKeyword) => {
    try {
      const { data } = await axios.get(
        `https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/chats?${searchKeyword}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setChats(data);
      console.log(data);
    } catch (error) {
      toast.error(error.response?.data);
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      const { data } = await axios.get(
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/user/logout",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      localStorage.setItem("userInfo", "");
      toast.success("Logout successfull");
      navigate("/");
    } catch (error) {
      toast.error(error.message || error.response?.data?.message);
    }
  };

  return (
    <>
      <div id="chats-sidebar">
        <div
          style={{
            backgroundColor: "#202c33",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "5px 10px",
          }}
        >
          <img
            onClick={() => setProfileModalShow(true)}
            src={user?.pic}
            height={40}
            style={{
              borderRadius: "50%",
              cursor: "pointer",
              // mixBlendMode: "multiply",
            }}
            width={40}
            alt=""
          />

          <span>
            <ChatIcon
              onClick={toggleDrawer(true)}
              style={{ marginRight: "10px", cursor: "pointer", color: "white" }}
            />
            <MoreVertIcon
              aria-describedby={id}
              onClick={handleClick}
              style={{ cursor: "pointer", color: "white" }}
            />

            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <div
                style={{
                  width: "130px",
                  padding: "5px 10px",
                }}
              >
                <p
                  onClick={() => {
                    handleClose();
                    setProfileModalShow(true);
                    return;
                  }}
                  style={{ color: "black", cursor: "pointer" }}
                >
                  Profile
                </p>
                <p
                  onClick={logout}
                  style={{ color: "black", cursor: "pointer" }}
                >
                  Logout
                </p>
              </div>
            </Popover>
          </span>
        </div>

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
              padding: "4px 10px",
              borderRadius: "15px",
              border: "none",
              width: "80%",
              color: "white",
            }}
            onChange={(e) => searchExistingChat(e.target.value)}
            type="text"
            placeholder="Search or start new chat"
          />
          <Button
            variant="contained"
            size="small"
            style={{
              backgroundColor: "#202c33",
              fontSize: "10px",
              padding: "2px",
            }}
            onClick={() => setModalShow(true)}
          >
            Group <AddIcon style={{ fontSize: "10px" }} />
          </Button>
        </div>

        <div id="chats" style={{ overflowY: "auto" }}>
          {chats.length >= 1 &&
            chats.map((chat) => (
              <div
                className="chat"
                key={chat._id}
                style={{
                  backgroundColor: selectedChat?._id == chat?._id && "#202c33",
                }}
                onClick={() => {
                  setSelectedChat(chat);
                  setNotification((prevNotif) => {
                    prevNotif?.filter((n) => n.chat?._id !== selectedChat?._id);
                  });
                }}
              >
                <img
                  style={{ borderRadius: "50%", marginRight: "5px" }}
                  src={
                    !chat.isGroupChat ? getSenderPic(chat.users) : chat.chatName
                  }
                  width={40}
                  height={40}
                  alt=""
                />

                <div
                  style={{
                    flexGrow: "1",
                    padding: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p style={{ opacity: "1", color: "white" }}>
                      {!chat.isGroupChat
                        ? getSenderName(chat.users)
                        : chat.chatName}
                    </p>
                    <p>{getNotif(chat.users)}</p>
                    {/* {chat?.latestMsg && (
                      <p
                        style={{
                          fontSize: "10px",
                          color: "gray",
                          opacity: "0.7",
                        }}
                      >
                        {checkDateStatus(
                          new Date(chat.latestMsg?.createdAt).toLocaleString(
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
                    )} */}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* {chat.latestMsg?.msgType === "text" ? (
                      <p style={{ fontSize: "12px", opacity: "0.7" }}>
                        {chat.latestMsg?.content}
                      </p>
                    ) : (
                      chat.latestMsg?.msgType
                    )} */}

                    {/* <p>{getNotif(chat.users)}</p> */}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* group chat modal */}

      <Dialog
        style={{ color: "black" }}
        onClose={() => setModalShow(false)}
        aria-labelledby="customized-dialog-title"
        open={modalShow}
      >
        <GroupChatModal modalShow={{ modalShow, setModalShow }} />
      </Dialog>

      {/* side drawer */}
      <Drawer open={openDrawer} onClose={toggleDrawer(false)}>
        <SideDrawer setOpenDrwer={setOpenDrwer} />
      </Drawer>

      {/* Profile Modal */}
      <Dialog
        onClose={() => setProfileModalShow(false)}
        aria-labelledby="customized-dialog-title"
        open={profileModalShow}
      >
        <ProfileModal setProfileModalShow={setProfileModalShow} />
      </Dialog>
    </>
  );
};

export default MyChats;
