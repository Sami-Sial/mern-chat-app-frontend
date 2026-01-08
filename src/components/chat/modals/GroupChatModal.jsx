import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ChatState } from "../../../context/ChatProvider";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";
import CircularProgress from "@mui/material/CircularProgress";

const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const GroupChatModal = ({ modalShow }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [groupPic, setGroupPic] = useState(null);
  const [groupPicPreview, setGroupPicPreview] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupCreating, setGroupCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { chats, setChats } = ChatState();
  const { token } = JSON.parse(localStorage.getItem("userInfo"));

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_BASE_URL}/api/user/all-users`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      toast.error(error.response?.data || "Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Search users
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredUsers(allUsers);
      return;
    }
    const filtered = allUsers.filter((user) =>
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // Group picture input
  const handleGroupPicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    setGroupPic(file);
    setGroupPicPreview(URL.createObjectURL(file));
  };

  const addUserToGroup = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      toast.error("This user is already added");
      return;
    }
    setSelectedUsers([...selectedUsers, user]);
    toast.success(`${user.name} added`);
  };

  const removeUserFromGroup = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    toast.info(`${user.name} removed`);
  };

  // ✅ Create group (send file to backend)
  const createGroup = async () => {
    if (!groupChatName.trim() || selectedUsers.length === 0) {
      toast.error("Please enter group name and add users");
      return;
    }

    if (!groupPic) {
      toast.error("Please select a group picture");
      return;
    }

    try {
      setGroupCreating(true);

      const formData = new FormData();
      formData.append("name", groupChatName);
      formData.append("users", JSON.stringify(selectedUsers.map((u) => u._id)));
      formData.append("groupPic", groupPic);

      const { data } = await axios.post(
        `${BACKEND_BASE_URL}/api/chats/group`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(data);
      setChats([data, ...chats]);
      toast.success("New group created successfully!");
      setGroupCreating(false);
      modalShow.setModalShow(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Error creating group");
      setGroupCreating(false);
    }
  };

  return (
    <Stack
      sx={{
        width: "400px",
        position: "relative",
        "@media (max-width:570px)": { width: "85vw" },
        maxHeight: "85vh",
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign: "center", fontWeight: 600 }}>
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

      {/* Inputs */}
      <div
        style={{
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 2,
          padding: "10px 16px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
        }}
      >
        <input
          value={groupChatName}
          onChange={(e) => setGroupChatName(e.target.value)}
          type="text"
          placeholder="Enter group name"
          style={{
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
        />

        {/* Group Picture */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleGroupPicChange}
            style={{
              border: "1px solid gray",
              padding: "6px",
              borderRadius: "5px",
              flex: 1,
            }}
          />
          <img
            src={
              groupPicPreview
            }
            alt="group"
            style={{
              width: "45px",
              height: "45px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #367134",
            }}
          />
        </div>

        {/* Selected Users */}
        <div>
          <h5 style={{ marginBottom: "6px" }}>Added Users</h5>
          {selectedUsers.length > 0 ? (
            selectedUsers.map((user) => (
              <Button
                key={user._id}
                style={{ marginRight: "8px", marginBottom: "5px" }}
                variant="contained"
                color="secondary"
                size="small"
                endIcon={
                  <DeleteIcon
                    style={{ marginLeft: "5px" }}
                    onClick={() => removeUserFromGroup(user)}
                  />
                }
              >
                {user.name}
              </Button>
            ))
          ) : (
            <p style={{ fontSize: "14px", color: "#555" }}>No user added</p>
          )}
        </div>

        {/* Search Input */}
        <input
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          type="text"
          placeholder="Search users..."
          style={{
            padding: "8px 10px",
            borderRadius: "5px",
            border: "1px solid gray",
          }}
        />
      </div>

      {/* Users List */}
      <DialogContent
        dividers
        style={{
          overflowY: "auto",
          maxHeight: "45vh",
          marginTop: "5px",
        }}
      >
        <h5 style={{ marginBottom: "10px", color: "black" }}>
          All Users of Talk-A-Tive
        </h5>

        {loading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="100%"
                height={45}
                sx={{ borderRadius: "5px", marginBottom: "8px" }}
              />
            ))}
          </>
        ) : filteredUsers.length === 0 ? (
          <p style={{ color: "#555" }}>No users found</p>
        ) : (
          filteredUsers.map((result) => (
            <div
              key={result._id}
              onClick={() => addUserToGroup(result)}
              id="user-list"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                marginBottom: "6px",
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <img
                style={{
                  border: "2px solid #367134",
                  borderRadius: "50%",
                  width: "35px",
                  height: "35px",
                  objectFit: "cover",
                }}
                src={result.pic}
                alt={result.name}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p style={{ margin: 0, fontWeight: 600, color: "black" }}>
                  {result.name}
                </p>
                <p style={{ margin: 0, fontSize: "12px", color: "#555" }}>
                  {result.email}
                </p>
              </div>
            </div>
          ))
        )}
      </DialogContent>

      {/* Footer */}
      <DialogActions
        style={{
          position: "sticky",
          bottom: 0,
          backgroundColor: "white",
          borderTop: "1px solid #ddd",
          padding: "10px",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => modalShow.setModalShow(false)}
        >
          Close
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={createGroup}
          disabled={groupCreating}
        >
          {groupCreating ? (
            <CircularProgress size={20} sx={{ color: "#fff" }} />
          ) : (
            "Create Group"
          )}
        </Button>
      </DialogActions>
    </Stack>
  );
};

export default GroupChatModal;
