import { useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Eye, EyeOff } from "lucide-react"; // Lucide icons
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const ProfileModal = ({ setProfileModalShow }) => {
  const navigate = useNavigate();
  const { user, setUser } = ChatState();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const logout = () => {
    setLogoutLoading(true);
    setTimeout(() => {
      localStorage.removeItem("userInfo");
      setUser(null);
      toast.success("Logout successfully");
      navigate("/");
    }, 2000);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,15}$/;
    return regex.test(password);
  };

  const handlePasswordUpdate = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error(
        "New password must have 1 uppercase, 1 lowercase, 1 number, allow special chars, and be 6-15 characters long"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.put(
        `${BACKEND_BASE_URL}/api/user/update-password`,
        { currentPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <DialogTitle sx={{ m: 0, p: 2 }}>
          <h3 style={{ color: "black" }}>{user.name}'s Profile</h3>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={() => setProfileModalShow(false)}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          {/* Profile Info */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
            <img
              src={user.pic}
              alt="Profile"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ccc",
              }}
            />
            <div>
              <div style={{ display: "flex" }}>
                <p style={{ width: "120px", color: "black" }}>
                  <b>Username:</b>
                </p>
                <span>{user.name}</span>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ width: "120px", color: "black" }}>
                  <b>Email:</b>
                </p>
                <span>{user.email}</span>
              </div>
              <div style={{ display: "flex" }}>
                <p style={{ width: "120px", color: "black" }}>
                  <b>Created At:</b>
                </p>
                <span>
                  {new Date(user.createdAt).toLocaleString("en-GB", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

            </div>
          </div>

          {/* Password Update */}
          <h4 style={{ marginTop: "20px", color: "black" }}>Update Password</h4>

          <TextField
            fullWidth
            label="Current Password"
            type={showCurrent ? "text" : "password"}
            variant="outlined"
            size="small"
            margin="dense"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowCurrent(!showCurrent)}>
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            type={showNew ? "text" : "password"}
            variant="outlined"
            size="small"
            margin="dense"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type={showConfirm ? "text" : "password"}
            variant="outlined"
            size="small"
            margin="dense"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{ marginTop: "10px" }}
            onClick={handlePasswordUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={logout}
            disabled={logoutLoading}
            sx={{ minWidth: "100px" }}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </Button>
        </DialogActions>
      </div>
    </>
  );
};

export default ProfileModal;
