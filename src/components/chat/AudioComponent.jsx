import { useReactMediaRecorder } from "react-media-recorder";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { ChatState } from "../../context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";

const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const Audio = ({
  setShowVoiceComponent,
  setMessages,
  messages,
  socket,
  setSelectedFile,
  selcetedFile,
}) => {
  const { selectedChat } = ChatState();
  const [isSendingVoice, setIsSendingVoice] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stopped, setStopped] = useState(false);

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ audio: true });

  useEffect(() => {
    startRecording();
  }, []);

  useEffect(() => {
    let timer;
    if (status === "recording") {
      timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
      setStopped(false);
    } else if (status === "stopped") {
      setStopped(true);
    }
    return () => clearInterval(timer);
  }, [status]);

  const handleDelete = () => {
    stopRecording();
    setShowVoiceComponent(false);
  };

  const sendVoice = async () => {
    setIsSendingVoice(true);
    let blobFile = await fetch(mediaBlobUrl).then((r) => r.blob());
    const audio = new File([blobFile], "selcetedFile", { type: blobFile.type });
    console.log(audio);

    setSelectedFile(audio);
    if (mediaBlobUrl) {
      try {
        const { token } = JSON.parse(localStorage.getItem("userInfo"));
        console.log(selcetedFile);

        const { data } = await axios.post(
          `${BACKEND_BASE_URL}/api/message`,
          { selcetedFile, chatId: selectedChat._id },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast.error("Failed to send audio");
        console.log(error);
      } finally {
        setIsSendingVoice(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "5px",
        gap: "10px",
        overflowX: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "black",
        borderRadius: "10px",
      }}
    >
      <Button
        style={{
          backgroundColor: status === "recording" ? "#25D366" : "#1a1f25",
          color: "white",
        }}
        variant="contained"
        size="small"
        onClick={startRecording}
      >
        {status === "recording" ? "Recording..." : "Start"}
      </Button>

      <Button
        style={{
          backgroundColor: "#1a1f25",
          color: "red",
        }}
        variant="contained"
        size="small"
        onClick={stopRecording}
      >
        Stop
      </Button>

      {status === "recording" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#25D366",
            fontWeight: "500",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "red",
              animation: "pulse 1s infinite",
            }}
          />
          <span>{formatTime(recordingTime)}</span>
        </div>
      )}

      {stopped && mediaBlobUrl && (
        <audio
          style={{ height: "30px", marginLeft: "10px" }}
          src={mediaBlobUrl}
          controls
        />
      )}

      <DeleteIcon
        style={{
          color: "white",
          cursor: "pointer",
        }}
        onClick={handleDelete}
      />

      {isSendingVoice ? (
        <CircularProgress size={20} color="secondary" />
      ) : (
        <SendIcon
          onClick={() => {
            if (status === "recording") {
              stopRecording();
            }
            sendVoice();
          }}
          style={{ color: "white", cursor: "pointer" }}
        />
      )}

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.6; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default Audio;
