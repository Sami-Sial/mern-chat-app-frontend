import React, { useEffect, useState } from "react";
import { ChatState } from "../../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import io from "socket.io-client";
const ENDPOINT = "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app";
let socket;

const VideoCall = () => {
  const navigate = useNavigate();
  const [callAccepted, setCallAccepted] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [zegoToken, setZegoToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);

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

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    if (videoCall.type == "out_going") {
      socket.on("accept_call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [videoCall]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const { token } = JSON.parse(localStorage.getItem("userInfo"));
        const { data } = await axios.get(
          `https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/generate-token/${user._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(data);
        setZegoToken(data.token);
      } catch (error) {
        console.log(error);
      }
    };
    getToken();
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          const zg = new ZegoExpressEngine(
            455461548,
            "93bf72f06763711e29100e84b42c1375"
          );
          setZgVar(zg);

          zg.on(
            "roomStreamUpdate",
            async (roomId, updateType, streamList, extendedData) => {
              if ((updateType = "ADD")) {
                const rmVideo = document.getElementById("remote-video");
                const vd = document.createElement("video");
                vd.id = streamList[0].streamID;
                vd.autoplay = true;
                vd.muted = false;
                vd.playsInline = true;
                if (rmVideo) {
                  rmVideo.appendChild(vd);
                }
                zg.startPlayingStream(streamList[0].streamID, {
                  audio: true,
                  video: true,
                }).then((stream) => (vd.srcObject = stream));
              } else if (
                (updateType =
                  "DELETE" && zg && localStream && streamList[0].streamID)
              ) {
                zg.destroyStream(localStream);
                zg.stopPublishingStream(streamList[0].streamID);
                zg.logoutRoom(data.roomId.toString());
                endCall();
              }
            }
          );

          await zg.loginRoom(
            videoCall.roomId,
            zegoToken,
            { userID: user._id, userName: user.name },
            { userUpdate: true }
          );

          const localStream = await zg.createStream({
            camera: { audio: true, video: true },
          });
          const localVideo = document.getElementById("local-video");
          const videoEl = document.createElement("video");
          videoEl.id = "video-local-zego";
          videoEl.autoplay = true;
          videoEl.muted = false;
          videoEl.playsInline = true;
          localVideo.appendChild(videoEl);
          const td = document.getElementById("video-local-zego");
          td.srcObject = localStream;
          const streamID = "123" + Date.now();
          setPublishStream(streamID);
          setLocalStream(localStream);
          zg.startPublishingStream(streamID, localStream);
        }
      );
    };

    if (zegoToken) {
      startCall();
    }
  }, [zegoToken]);

  let sender = selectedChat?.users?.filter((u) => {
    return u._id !== user._id;
  });

  const endCall = () => {
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(videoCall.roomId);
    }

    socket.emit("reject_video_call", { to: sender[0]._id });
    setVideoCall(undefined);
  };

  useEffect(() => {
    socket.emit("join chat", selectedChat?._id);
    console.log(videoCall);

    if (videoCall.type == "out_going") {
      socket.emit("outgoing_video_call", {
        to: sender[0]._id,
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
    <>
      {/* // <div style={{ textAlign: "center" }}>
    <h2 style={{ fontWeight: "500" }}>{senderName}</h2>
    <p>{callAccepted ? "on-going-call" : "calling"}</p>
    <img
      src={senderImg}
     width={200}
      height={200}
       style={{ borderRadius: "50%" }}
      alt=""
    /> */}
      <div id="remote-video">
        <div
          id="local-video"
          style={{ position: "absolute", top: "5rem", right: "5rem" }}
        ></div>
      </div>
      <button onClick={endCall}>End Call</button>
      {/* </div> */}
    </>
  );
};

export default VideoCall;
