import { useEffect } from "react";
import { ChatState } from "../../../context/ChatProvider";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import axios from "axios";

const SenderProfileModal = ({ setShowSenderProfileModal }) => {
  const { user, selectedChat } = ChatState();

  let getSender = selectedChat.users.filter((u) => {
    return u._id !== user._id;
  });

  let sender = getSender[0];

  return (
    <>
      <div>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <h3>{sender.name}'s Profile</h3>
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
          <div style={{ display: "flex" }}>
            <p style={{ width: "100px", color: "black" }}>
              <b>Username:</b>
            </p>
            {sender.name}
          </div>
          <div style={{ display: "flex" }}>
            <p style={{ width: "100px", color: "black" }}>
              <b>Email:</b>
            </p>
            {sender.email}
          </div>

          <div>
            <img
              style={{
                border: "solid",
                borderRadius: "10px",
                marginTop: "15px",
              }}
              src={sender.pic}
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
