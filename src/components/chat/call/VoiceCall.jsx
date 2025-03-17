import React, { useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import { Button } from "@mui/material";

import io from "socket.io-client";
const ENDPOINT = "http://localhost:8080";
let socket;

const VoiceCall = () => {
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
    incomingVoiceCall,
    voiceCall,
    videoCall,
  } = ChatState();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  let sender = selectedChat?.users?.filter((u) => {
    return u._id !== user._id;
  });

  const endCall = () => {
    socket.emit("reject_voice_call", { to: sender[0]._id });
    setVoiceCall(undefined);
  };

  useEffect(() => {
    socket.emit("join chat", selectedChat._id);
    console.log(voiceCall);

    if (voiceCall.type == "out_going") {
      socket.emit("outgoing_voice_call", {
        to: sender[0]._id,
        from: {
          id: user._id,
          pic: user.pic,
          name: user.name,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall, selectedChat]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        width: "100vw",
        alignItems: "center",
        gap: "3rem",
        backgroundColor: "#121b21",
        color: "white",
        height: "100%",
      }}
    >
      <div>
        <h2>{sender[0]?.name}</h2>
        <p>{callAccepted ? "on-going-call" : "calling"}</p>
      </div>
      <img
        src={logo}
        width={250}
        height={250}
        style={{ borderRadius: "50%" }}
        alt=""
      />
      <Button variant="contained" color="error" onClick={endCall}>
        End Call
      </Button>
    </div>
  );
};

export default VoiceCall;
