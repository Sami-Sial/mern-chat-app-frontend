import React, { useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const ENDPOINT = "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app";
let socket;

const VideoCall = () => {
  const navigate = useNavigate();
  const [callAccepted, setCallAccepted] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const {
    selectedChat,
    user,
    setVideoCall,
    setVoiceCall,
    setIncomingVoiceCall,
    setIncomingVideoCall,
    incomingVideoCall,
    voiceCall,
    videoCall,
  } = ChatState();

  // Initialize socket connection
  useEffect(() => {
    socket = io(ENDPOINT, {
      transports: ["websocket"], // Force WebSocket only
    });
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  // Handle call acceptance
  useEffect(() => {
    if (videoCall.type === "out_going") {
      socket.on("accept_call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [videoCall]);

  const sender = selectedChat?.users?.filter((u) => u._id !== user._id);
  const senderName = sender?.[0]?.name;
  const senderImg = sender?.[0]?.pic;

  const endCall = () => {
    socket.emit("reject_video_call", { to: sender?.[0]?._id });
    setVideoCall(undefined);
  };

  // Emit call events
  useEffect(() => {
    socket.emit("join chat", selectedChat?._id);
    console.log(videoCall);

    if (videoCall.type === "out_going") {
      socket.emit("outgoing_video_call", {
        to: sender?.[0]?._id,
        from: {
          id: user._id,
          pic: user.pic,
          name: user.name,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall, selectedChat]);

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        background: "linear-gradient(160deg, #0b141a 0%, #202c33 100%)",
        color: "white",
      }}
    >
      <h2 style={{ fontWeight: "500" }}>{senderName}</h2>
      <p
        style={{
          marginTop: "0.5rem",
          fontSize: "1.1rem",
          color: callAccepted ? "#25D366" : "#b1b3b5",
          fontWeight: "500",
          transition: "color 0.3s ease",
        }}
      >
        {callAccepted ? "On-going call" : "Calling..."}
      </p>

      <img
        src={senderImg}
        width={200}
        height={200}
        style={{
          borderRadius: "50%",
          border: "4px solid #25D366",
          boxShadow: "0 0 25px #25D36655",
          padding: "5px",
        }}
        alt=""
      />

      <div
        id="remote-video"
        style={{
          width: "80%",
          height: "60%",
          marginTop: "2rem",
          borderRadius: "10px",
          background: "#111",
          position: "relative",
        }}
      >
        <div
          id="local-video"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "150px",
            height: "100px",
            background: "#222",
            borderRadius: "8px",
          }}
        ></div>
      </div>

      <button
        onClick={endCall}
        style={{
          marginTop: "2rem",
          padding: "12px 40px",
          backgroundColor: "#ff3b30",
          border: "none",
          borderRadius: "50px",
          color: "white",
          fontSize: "1rem",
          fontWeight: "600",
          boxShadow: "0 0 15px #ff3b30aa",
          cursor: "pointer",
        }}
      >
        End Call
      </button>
    </div>
  );
};

export default VideoCall;
