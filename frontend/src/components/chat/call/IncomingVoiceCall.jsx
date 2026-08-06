import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Button } from "@mui/material";
import Draggable from "react-draggable";
import logo from "../../../assets/logo.png";
import { ChatState } from "../../../context/ChatProvider";

const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const ENDPOINT = BACKEND_BASE_URL;
let socket;

const IncomingVoiceCall = () => {
  const nodeRef = useRef(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const { user, incomingVoiceCall, setVoiceCall, setIncomingVoiceCall } =
    ChatState();

  // 🧩 Socket setup
  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket"] });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));

    return () => {
      socket.disconnect();
    };
  }, [user]);
  // 🧩 Join call room
  useEffect(() => {
    if (incomingVoiceCall?.roomId) {
      socket.emit("join chat", incomingVoiceCall.roomId);
    }
  }, [incomingVoiceCall]);

  // ❌ Reject call
  const rejectVoiceCall = () => {
    if (!incomingVoiceCall) return;
    socket.emit("reject_voice_call", { to: incomingVoiceCall.id });
    setVoiceCall(undefined);
    setIncomingVoiceCall(undefined);
  };

  // ✅ Accept call
  const acceptCall = () => {
    if (!incomingVoiceCall) return;
    setVoiceCall({ ...incomingVoiceCall, type: "in_coming" });
    socket.emit("accept_incoming_call", { to: incomingVoiceCall.id });
    setIncomingVoiceCall(undefined);
  };

  if (!incomingVoiceCall) return null;

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="body" // restricts movement within document body
    >
      <div
        ref={nodeRef}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "fixed",
          top: "5rem",
          right: "3rem",
          zIndex: 10000,
          background: "rgba(17, 27, 33, 0.95)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "white",
          padding: "10px 16px",
          borderRadius: "14px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          minWidth: "260px",
          maxWidth: "320px",
          cursor: "grab",
          transition: "all 0.3s ease",
          userSelect: "none",
        }}
      >
        {/* 📸 Caller Avatar */}
        <img
          src={logo}
          width={45}
          height={45}
          alt="Caller Avatar"
          style={{
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #25D366",
            boxShadow: "0 0 10px #25D36655",
            mixBlendMode: "multiply",
          }}
        />

        {/* 📞 Call Info */}
        <div style={{ flex: 1 }}>
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: "600",
              color: "#e9edef",
            }}
          >
            Incoming Voice Call
          </h3>

          <p
            style={{
              margin: "4px 0 10px",
              fontSize: "0.85rem",
              color: "#8696a0",
            }}
          >
            {incomingVoiceCall?.name || "Unknown Caller"}
          </p>

          {/* 🎛️ Action Buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <Button
              variant="contained"
              size="small"
              onClick={acceptCall}
              title="accept call"
              sx={{
                minWidth: "36px",
                borderRadius: "50%",
                backgroundColor: "#25D366",
                boxShadow: "0 0 10px #25D366aa",
                "&:hover": { backgroundColor: "#20ba57" },
              }}
            >
              📞
            </Button>

            <Button
              variant="contained"
              size="small"
              onClick={rejectVoiceCall}
              title="reject call"
              sx={{
                minWidth: "36px",
                borderRadius: "50%",
                backgroundColor: "#FF3B30",
                boxShadow: "0 0 10px #ff3b30aa",
                "&:hover": { backgroundColor: "#e02d25" },
              }}
            >
              ❌
            </Button>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default IncomingVoiceCall;
