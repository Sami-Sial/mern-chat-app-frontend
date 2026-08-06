import React, { useEffect, useRef, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import logo from "../../../assets/logo.png";
import io from "socket.io-client";
import Peer from "peerjs";

const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const ENDPOINT = BACKEND_BASE_URL;
let socket;

const VoiceCall = () => {
  const navigate = useNavigate();
  const [callAccepted, setCallAccepted] = useState(false);
  const [peerId, setPeerId] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const { selectedChat, user, setVoiceCall, voiceCall } = ChatState();
  const audioRef = useRef();

  const sender = selectedChat?.users?.find((u) => u._id !== user._id);
  const receiver = selectedChat?.users?.find((u) => u._id === user._id);

  // Initialize Socket
  useEffect(() => {
    socket = io(ENDPOINT, { transports: ["websocket"] });
    socket.emit("setup", user);
  }, []);

  // Initialize PeerJS
  useEffect(() => {
    const peer = new Peer(undefined, {
      host: "localhost",
      port: 3000,
      path: "/peerjs",
      secure: false, // don't use secure for localhost
    });

    peer.on("open", (id) => {
      console.log("My peer ID:", id);
      setPeerId(id);
    });

    // Listen for incoming call
    peer.on("call", async (call) => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);
      call.answer(stream);

      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        setCallAccepted(true);
      });
    });

    // Cleanup
    return () => {
      peer.destroy();
    };
  }, []);

  // When outgoing call starts
  useEffect(() => {
    if (!voiceCall || !peerId) return;

    socket.emit("join chat", voiceCall.roomId);

    if (voiceCall.type === "out_going") {
      // Send outgoing call invitation with peerId
      socket.emit("outgoing_voice_call", {
        to: sender?._id,
        from: {
          id: user._id,
          name: user.name,
          pic: user.pic,
        },
        peerId,
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }

    // Listen for the callee to send back peerId
    socket.on("accept_voice_call", async ({ peerId: remotePeerId }) => {
      const peer = new Peer();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setLocalStream(stream);

      const call = peer.call(remotePeerId, stream);
      call.on("stream", (remoteStream) => {
        setRemoteStream(remoteStream);
        setCallAccepted(true);
      });
    });
  }, [voiceCall, peerId]);

  // Attach remote stream to audio element
  useEffect(() => {
    if (remoteStream && audioRef.current) {
      audioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const endCall = () => {
    socket.emit("reject_voice_call", { to: voiceCall.id });
    setVoiceCall(undefined);

    localStream?.getTracks().forEach((track) => track.stop());

    if (audioRef.current) audioRef.current.srcObject = null;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "4rem",
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(160deg, #0b141a 0%, #202c33 100%)",
        color: "white",
        textAlign: "center",
        position: "relative",
      }}
    >
      <div>
        <h2 style={{ fontSize: "2rem", fontWeight: "600" }}>
          {voiceCall.type === "out_going" ? sender?.name : voiceCall.name}
        </h2>
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "1.1rem",
            color: callAccepted ? "#25D366" : "#b1b3b5",
            fontWeight: "500",
          }}
        >
          {callAccepted ? "On-going call" : "Calling..."}
        </p>
      </div>

      <img
        src={logo}
        width={200}
        height={200}
        alt="Caller Avatar"
        style={{
          borderRadius: "50%",
          border: "4px solid #25D366",
          boxShadow: "0 0 25px #25D36655",
          padding: "5px",
        }}
      />

      <Button
        variant="contained"
        color="error"
        onClick={endCall}
        sx={{
          mt: 2,
          px: 4,
          py: 1.5,
          fontSize: "1rem",
          fontWeight: "600",
          borderRadius: "50px",
        }}
      >
        End Call
      </Button>

      <audio ref={audioRef} autoPlay />

      {/* Animated ring */}
      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          border: "2px solid rgba(37,211,102,0.2)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "ring 2.5s infinite ease-in-out",
        }}
      />
    </div>
  );
};

export default VoiceCall;
