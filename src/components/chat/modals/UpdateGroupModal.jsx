import React from "react";
import { useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

const UpdateGroupModal = ({ setShowUpdateGroupModal }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const { token } = JSON.parse(localStorage.getItem("userInfo"));

  const searchHandler = async (query) => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/user/all-users?search=${query}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSearchResult(data);
      setLoading(false);
      console.log(searchResult);
    } catch (error) {
      toast.error(error.response?.data);
      console.log(error);
    }
  };

  const renameGroup = () => {
    if (!groupChatName) return;
    try {
      const { data } = axios.put(
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/chats/group/rename",
        { chatId: selectedChat._id, chatName: groupChatName },
        {
          headers: [
            { "Content-Type": "application/json" },
            { Authorization: `Bearer ${token}` },
          ],
        }
      );
      console.log(data);

      setSelectedChat(data);
    } catch (error) {
      toast.error(error.response.data);
      console.log(error);
    }
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User is already in group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add users");
      return;
    }

    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.put(
        `https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/chats/group/add_user`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: [
            { "Content-Type": "application/json" },
            { Authorization: `Bearer ${token}` },
          ],
        }
      );

      setSelectedChat(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data);
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can remove someone");
      return;
    }
    console.log(selectedChat.users.length);

    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.put(
        `https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/chats/group/remove_user`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: [
            { "Content-Type": "application/json" },
            { Authorization: `Bearer ${token}` },
          ],
        }
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data);
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <div style={{ width: "400px" }}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <h3>Update Group</h3>
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setShowUpdateGroupModal(false)}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        dividers
      >
        <div style={{ display: "flex", gap: "5px" }}>
          <input
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            type="text"
            placeholder="Enter group name"
            style={{
              flexGrow: "1",
              padding: "8px 10px",
              borderRadius: "5px",
              border: "1px solid gray",
            }}
          />
          <Button variant="contained" size="small" onClick={renameGroup}>
            Rename
          </Button>
        </div>
        <input
          onChange={(e) => searchHandler(e.target.value)}
          type="text"
          placeholder="Add users e.g sami"
          style={{
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
        />

        {/* added users */}
        <div>
          <h5 style={{ marginBottom: "10px" }}>Added Users</h5>
          {selectedChat.isGroupChat &&
            selectedChat.users.map((u) => (
              <Button
                key={u._id}
                style={{ marginRight: "10px", marginBottom: "5px" }}
                variant="contained"
                color="secondary"
                size="small"
                endIcon={
                  <DeleteIcon
                    style={{
                      marginLeft: "5px",
                    }}
                    onClick={() => handleRemove(u)}
                  />
                }
              >
                {u.name}
              </Button>
            ))}
        </div>

        {/* search results */}
        <div>
          {searchResult &&
            searchResult.map((result) => (
              <div
                onClick={() => handleAddUser(result)}
                id="user-list"
                key={result._id}
              >
                <span>
                  <img
                    style={{
                      border: "2px solid #367134",
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                    src={result.pic}
                    height={30}
                    width={30}
                  />
                </span>
                <div>
                  <p>{result.name}</p>
                  <p>Email: {result.email}</p>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleRemove(user)}
        >
          Leave Group
        </Button>
      </DialogActions>
    </div>
  );
};

export default UpdateGroupModal;
