import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../../context/ChatProvider";
import { Button } from "@mui/material";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";

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

const SideDrawer = ({ setOpenDrwer }) => {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const { setSelectedChat, chats, setChats } = ChatState();

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(
        `${BACKEND_BASE_URL}/api/user/all-users?search=${searchInput}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(data);
    } catch (error) {
      toast.error(error.response?.data);
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const searchHandler = async () => {
    if (!searchInput) {
      return toast.error("Please enter something");
    }

    fetchUsers();
    setSearchInput("");
  };

  const accessChat = async (userId) => {
    try {

      setChatLoading(true);
      const { token } = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.post(
        `${BACKEND_BASE_URL}/api/chats`,
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSearchInput("");
      setUsers([]);

      if (chats && !chats.find((c) => c._id == data._id)) {
        setOpenDrwer(false);
        setChats([data, ...chats]);
        return setSelectedChat(data);
      }

      setOpenDrwer(false);
      setSelectedChat(data);
    } catch (error) {
      toast.error(error.response?.data);
      console.log(error);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ backgroundColor: "#111b21", color: "white", display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#202c33",
          padding: "1rem",
        }}
      >
        <h3 style={{ margin: 0 }}>Create New Chat</h3>
        <IconButton onClick={() => setOpenDrwer(false)} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </div>

      <div
        className="custom-scrollbar"
        style={{
          flexGrow: 1,
          overflow: "auto",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
            gap: "10px",
          }}
        >
          <input
            style={{
              backgroundColor: "#202c33",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #c4cdd5",
              width: "100%",
              color: "white",
              fontSize: "14px",
              outline: "none"
            }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search users by names or emails..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                searchHandler();
              }
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={searchHandler}
            sx={{ borderRadius: "8px" }}
          >
            Search
          </Button>
        </div>

        {loading ? (
          <ChatLoading />
        ) : (
          <div>
            <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
              Users of Tak-A-tive
            </h4>
            {users?.map((user) => (
              <div style={{ 
                display: "flex", 
                padding: "12px", 
                alignItems: "center", 
                gap: "12px", 
                backgroundColor: "#202c33", 
                borderRadius: "10px", 
                marginBottom: "10px",
                cursor: "pointer",
                transition: "background 0.2s"
              }} 
              key={user._id}
              onClick={() => accessChat(user._id)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#2a3942"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#202c33"}
              >
                {user.pic ? (
                  <img
                    style={{
                      border: "2px solid #367134",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                    src={user.pic}
                    height={45}
                    width={45}
                  />
                ) : (
                  <Avatar
                    sx={{
                      bgcolor: stringToColor(user.name),
                      width: 45,
                      height: 45,
                      border: "2px solid #367134"
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <div style={{ flexGrow: "1" }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#8696a0" }}>{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
          flexDirection: "column",
          gap: "15px",
        }}
        open={chatLoading}
      >
        <CircularProgress color="primary" size={60} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          Creating your chat...
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Please wait a moment 💬
        </Typography>
      </Backdrop>


    </div>
  );
};

export default SideDrawer;
