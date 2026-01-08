import { ChatState } from "../../../context/ChatProvider";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const SenderProfileModal = ({ setShowSenderProfileModal }) => {
  const { user, selectedChat } = ChatState();

  const getSender = selectedChat.users.filter((u) => u._id !== user._id);
  const sender = getSender[0];

  return (
    <>
      <div>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <h3 style={{ color: "black" }}>{sender.name}'s Profile</h3>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={() => setShowSenderProfileModal(false)}
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
          {/* Profile Header with Image on Left */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <img
              src={sender.pic}
              alt="Sender Profile"
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
                <span>{sender.name}</span>
              </div>

              <div style={{ display: "flex" }}>
                <p style={{ width: "120px", color: "black" }}>
                  <b>Email:</b>
                </p>
                <span>{sender.email}</span>
              </div>

              <div style={{ display: "flex" }}>
                <p style={{ width: "120px", color: "black" }}>
                  <b>Joined At:</b>
                </p>
                <span>
                  {sender.createdAt
                    ? new Date(sender.createdAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            autoFocus
            onClick={() => setShowSenderProfileModal(false)}
          >
            Close
          </Button>
        </DialogActions>
      </div>
    </>
  );
};

export default SenderProfileModal;
