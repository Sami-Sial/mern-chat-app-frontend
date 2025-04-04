import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ChatState } from "../../../context/ChatProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "react-bootstrap/Modal";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import Stack from "@mui/material/Stack";

const GroupChatModal = ({ modalShow }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { chats, setChats, setGroupModalShow } = ChatState();
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

  const addUserToGroup = (user) => {
    if (selectedUsers.includes(user)) {
      toast.error("This user is already added");
      return;
    }

    setSelectedUsers([...selectedUsers, user]);
    toast.success("New user added to group");
  };

  const removeUserFromGroup = (user) => {
    selectedUsers.filter((selected) => {
      return selected._id !== user._id;
    });
    toast.success("User removed from group");
  };

  const createGroup = async () => {
    if (!groupChatName || !searchResult) {
      toast.error("Please fill all the fields");
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.post(
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/chats/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        {
          headers: [
            { "Content-Type": "application/json" },
            { Authorization: `Bearer ${token}` },
          ],
        }
      );

      setChats(data, ...chats);

      console.log(data);
      setLoading(false);
      setGroupModalShow(false);
      toast.success("New Group created");
    } catch (error) {
      toast.error(error.response?.data);
      console.log(error);
    }
  };

  return (
    <Stack
      sx={{ width: "400px", "@media (max-width:570px)": { width: "85vw" } }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Create Group Chat
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => modalShow.setModalShow(false)}
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
        <input
          value={groupChatName}
          style={{
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
          onChange={(e) => setGroupChatName(e.target.value)}
          type="text"
          placeholder="Enter group name"
        />

        <input
          style={{
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
          onChange={(e) => searchHandler(e.target.value)}
          type="text"
          placeholder="Add users e.g sami"
        />

        {/* added users */}
        <div>
          <h5 style={{ marginBottom: "10px" }}>Added Users</h5>
          {selectedUsers && selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <Button
                style={{ marginRight: "10px", marginBottom: "5px" }}
                variant="contained"
                color="secondary"
                size="small"
                endIcon={
                  <DeleteIcon
                    style={{
                      marginLeft: "5px",
                    }}
                    onClick={() => removeUserFromGroup(user)}
                  />
                }
              >
                {user.name}
              </Button>
            ))
          ) : (
            <p>No user added</p>
          )}
        </div>

        {/* search results */}
        <div>
          {searchResult &&
            searchResult.map((result) => (
              <div
                onClick={() => addUserToGroup(result)}
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

        <Button size="small" variant="contained" onClick={createGroup}>
          Create Group
        </Button>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          autoFocus
          onClick={() => modalShow.setModalShow(false)}
        >
          Close
        </Button>
      </DialogActions>
    </Stack>
  );
};

export default GroupChatModal;
