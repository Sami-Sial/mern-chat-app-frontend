import { ChatState } from "../../context/ChatProvider";
import { useContext, useEffect, useState } from "react";
import Nav from "./Nav";
import MyChats from "./MyChats.jsx";
import Main from "./Main.jsx";
import VoiceCall from "./call/VoiceCall";
import VideoCall from "./call/VideoCall";
import IncomingVoiceCall from "./call/IncomingVoiceCall.jsx";
import IncomingVideoCall from "./call/IncomingVideoCall.jsx";

const Chat = () => {
  const { user, voiceCall, videoCall, incomingVoiceCall, incomingVideoCall } =
    ChatState();

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
        <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
          <div
            style={{
              width: "25%",
              height: "100vh",
              borderRight: "2px solid #111b21",
              backgroundColor: "#111b21",
            }}
          >
            <MyChats />
          </div>

          <div
            style={{
              width: "75%",
              height: "100vh",
              backgroundColor: "#202c33",
            }}
          >
            <Main />
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
