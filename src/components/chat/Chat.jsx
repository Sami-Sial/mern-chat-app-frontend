import { ChatState } from "../../context/ChatProvider";
import { useContext, useEffect, useState } from "react";
import Nav from "./Nav";
import MyChats from "./MyChats.jsx";
import Main from "./Main.jsx";
import VoiceCall from "./call/VoiceCall";
import VideoCall from "./call/VideoCall";
import IncomingVoiceCall from "./call/IncomingVoiceCall.jsx";
import IncomingVideoCall from "./call/IncomingVideoCall.jsx";
import Stack from "@mui/material/Stack";

const Chat = () => {
  const {
    user,
    selectedChat,
    voiceCall,
    videoCall,
    incomingVoiceCall,
    incomingVideoCall,
  } = ChatState();

  console.log(selectedChat);

  return (
    <>
      {incomingVoiceCall && <IncomingVoiceCall />}

      {incomingVideoCall && <IncomingVideoCall />}

      {voiceCall && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <VoiceCall />
        </div>
      )}

      {videoCall && (
        <div
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <VideoCall />
        </div>
      )}

      {user && (
        <div style={{ display: "flex", width: "100vw" }}>
          <Stack
            sx={{
              width: "25%",
              height: "100vh",
              borderRight: "2px solid #111b21",
              backgroundColor: "#111b21",
              "@media (max-width:900px)": { width: "28%" },
              "@media (max-width:700px)": selectedChat
                ? { display: "none" }
                : { display: "block", width: "100vw" },
            }}
          >
            <MyChats />
          </Stack>

          <Stack
            sx={{
              width: "75%",
              height: "100vh",
              backgroundColor: "#202c33",
              "@media (max-width:900px)": { width: "73%" },
              "@media (max-width:700px)": selectedChat
                ? { display: "block", width: "100vw" }
                : { display: "none" },
            }}
          >
            <Main />
          </Stack>
        </div>
      )}
    </>
  );
};

export default Chat;
