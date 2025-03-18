import React from "react";
import io from "socket.io-client";
const ENDPOINT = "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app";
let socket;
import { ChatState } from "../../../context/ChatProvider";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import logo from "../../../assets/logo.png";

const IncomingVoiceCall = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const { user, incomingVoiceCall, setVoiceCall, setIncomingVoiceCall } =
    ChatState();

  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"], // Force WebSocket only
    });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.emit("join chat", incomingVoiceCall.roomId);
  }, []);

  const rejectVoiceCall = () => {
    socket.emit("reject_voice_call", {
      to: incomingVoiceCall.id,
    });
    setVoiceCall(undefined);
    setIncomingVoiceCall(undefined);
  };

  const acceptCall = () => {
    setVoiceCall({ ...incomingVoiceCall, type: "in_coming" });
    socket.emit("accept_incoming_call", { to: incomingVoiceCall.id });
    setIncomingVoiceCall(undefined);
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
        <h2 style={{ marginBottom: "15px" }}>Incoming voice call</h2>
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
          onClick={rejectVoiceCall}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default IncomingVoiceCall;
