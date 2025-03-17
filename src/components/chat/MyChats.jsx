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
  } = ChatState();
  const { token } = JSON.parse(localStorage.getItem("userInfo"));

  let loggedUser = user;
  const getSender = (users) => {
    if (users) {
      return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
      // senderPic = users[0]._id === loggedUser._id ? users[1].pic : users[0].pic;
    }
  };

  console.log(notification);
  notification.filter((notif) => {
    console.log(notif.sender._id);
  });

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axios.get("/api/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setChats(data);
      } catch (error) {
        toast.error(error.response?.data);
        console.log(error);
      }
    };

    fetchChats();
  }, []);

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
                onClick={() => setSelectedChat(chat)}
              >
                <img
                  style={{ borderRadius: "50%", marginRight: "5px" }}
                  src={logo}
                  width={40}
                  height={40}
                  alt=""
                />

                <div
                  style={{
                    borderBottom: "2px solid #202c33",
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
                    <p style={{ opacity: "1" }}>
                      {!chat.isGroupChat
                        ? getSender(chat.users)
                        : chat.chatName}
                    </p>
                    <p style={{ fontSize: "12px" }}>time</p>
                  </div>
                  <p style={{ fontSize: "12px" }}>latest msg</p>
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
