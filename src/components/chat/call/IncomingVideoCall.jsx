import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../../../assets/logo.png";

import io from "socket.io-client";
const ENDPOINT = "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app";
let socket;
import { ChatState } from "../../../context/ChatProvider";
import { useState, useEffect } from "react";

const IncomingVoiceCall = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, incomingVideoCall, setVideoCall, setIncomingVideoCall } =
    ChatState();

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"], // Force WebSocket only
    });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.emit("join chat", incomingVideoCall.roomId);
  });

  const rejectVideoCall = () => {
    socket.emit("reject_video_call", {
      to: incomingVideoCall.id,
    });
    setVideoCall(undefined);
    setIncomingVideoCall(undefined);
  };

  const acceptCall = () => {
    setVideoCall({ ...incomingVideoCall, type: "in_coming" });
    socket.emit("accept_incoming_call", { to: incomingVideoCall.id });
    setIncomingVideoCall(undefined);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "15px",
        position: "absolute",
        zIndex: "10",
        top: "5rem",
        right: "5rem",
        color: "white",
        padding: "10px 20px",
        borderRadius: "15px",
        backgroundColor: "#0b141a",
      }}
    >
      <img
        style={{ mixBlendMode: "multiply" }}
        src={logo}
        width={50}
        height={50}
        alt=""
      />

      <div>
        <h2 style={{ marginBottom: "15px" }}>Incoming video call</h2>
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={acceptCall}
          style={{ marginRight: "10px" }}
        >
          Accept
        </Button>

        <Button
          color="error"
          size="small"
          variant="contained"
          onClick={rejectVideoCall}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default IncomingVoiceCall;
