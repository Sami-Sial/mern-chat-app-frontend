import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../../context/ChatProvider";
import { Button } from "@mui/material";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";


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
    <div
      style={{
        height: "100vh",
        backgroundColor: "#111b21",
        overflow: "hidden",
        color: "white",
        width: "330px",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "4rem",
          alignItems: "center",
          backgroundColor: "#202c33",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <TrendingFlatIcon style={{ fontSize: "40px" }} />
        <h3>Create New Chat</h3>
        <span
          style={{
            position: "absolute",
            right: "10px",
            top: "5px",
            cursor: "pointer",
          }}
        >
          <CloseIcon onClick={() => setOpenDrwer(false)} />
        </span>
      </div>

      <div
        style={{
          minHeight: "calc(100vh - 4rem",
          maxHeight: "calc(100vh - 4rem",
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "white #111b21",
          padding: "0 10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem 0",
            gap: "2px",
          }}
        >
          <input
            style={{
              backgroundColor: "#202c33",
              padding: "6px 10px",
              borderRadius: "15px",
              border: "none",
              width: "80%",
              color: "white",
            }}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search users by names or emails"
          />
          <Button
            variant="contained"
            color="dark"
            size="small"
            onClick={searchHandler}
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
              <div style={{ display: "flex", padding: "10px" }} key={user._id}>
                <span>
                  <img
                    style={{
                      border: "2px solid #367134",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                    src={user.pic}
                    height={40}
                    width={40}
                  />
                </span>
                <div
                  onClick={() => accessChat(user._id)}
                  style={{
                    flexGrow: "1",
                    borderBottom: "2px solid #202c33",
                    cursor: "pointer",
                  }}
                >
                  <p>{user.name}</p>
                  <p style={{ fontSize: "14px" }}>Email: {user.email}</p>
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
