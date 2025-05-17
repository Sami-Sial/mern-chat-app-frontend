import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../../context/ChatProvider";
import { Button } from "@mui/material";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import CloseIcon from "@mui/icons-material/Close";

const SideDrawer = ({ setOpenDrwer }) => {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const { setSelectedChat, chats, setChats } = ChatState();

  const fetchUsers = async () => {
    setChatLoading(true);
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get(
        `https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/user/all-users?search=${searchInput}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUsers(data);
    } catch (error) {
      toast.error(error.response?.data);
      console.log(error);
    } finally {
      setChatLoading(false);
    }
  };

  const searchHandler = async () => {
    if (!searchInput) {
      return toast.error(
        "How can empty field be searched? Please enter something"
      );
    }

    fetchUsers();
    setSearchInput("");
  };

  const accessChat = async (userId) => {
    setLoading(true);

    try {
      setOpenDrwer(false);

      const { token } = JSON.parse(localStorage.getItem("userInfo"));

      const { data } = await axios.post(
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/chats",
        { userId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      setSearchInput("");
      setUsers([]);

      if (chats && !chats.find((c) => c._id == data._id)) {
        return setChats([data, ...chats]);
      }

      setSelectedChat(data);
    } catch (error) {
      toast.error(error.response?.data);
      console.log(error);
    } finally {
      setLoading(false);
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
        <h3>New Chat</h3>
        <span
          style={{
            position: "absolute",
            left: "230px",
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
              padding: "2px 10px",
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
            disabled={loading || chatLoading ? true : false}
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
            {chatLoading ? (
              <ChatLoading />
            ) : (
              <>
                {users?.map((user) => (
                  <div
                    style={{ display: "flex", padding: "10px" }}
                    key={user._id}
                  >
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
                      <p style={{ fontSize: "12px" }}>Email: {user.email}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SideDrawer;
