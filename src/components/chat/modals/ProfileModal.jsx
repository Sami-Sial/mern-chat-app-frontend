import { ChatState } from "../../../context/ChatProvider";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ setProfileModalShow }) => {
  const navigate = useNavigate();
  const { user } = ChatState();

  const logout = async () => {
    try {
      const { token } = JSON.parse(localStorage.getItem("userInfo"));
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
      <div>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <h3>{user.name}'s Profile</h3>
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
          <div style={{ display: "flex" }}>
            <p style={{ width: "100px", color: "black" }}>
              <b>Username:</b>
            </p>
            {user.name}
          </div>
          <div style={{ display: "flex" }}>
            <p style={{ width: "100px", color: "black" }}>
              <b>Email:</b>
            </p>
            {user.email}
          </div>

          <div>
            <img
              style={{
                border: "solid",
                borderRadius: "10px",
                marginTop: "15px",
              }}
              src={user.pic}
              height={180}
              width={280}
              alt=""
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            autoFocus
            onClick={logout}
          >
            Logout
          </Button>
        </DialogActions>
      </div>
    </>
  );
};

export default ProfileModal;
