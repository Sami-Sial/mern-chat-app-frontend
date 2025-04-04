import { useReactMediaRecorder } from "react-media-recorder";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { ChatState } from "../../context/ChatProvider";
import { toast } from "react-toastify";
import axios from "axios";
import Box from "@mui/material/Stack";

const Audio = ({
  setShowVoiceComponent,
  setMessages,
  messages,
  socket,
  setSelectedFile,
  selcetedFile,
}) => {
  const { selectedChat } = ChatState();
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
    });

  const handleDelete = () => {
    stopRecording();
    setShowVoiceComponent(false);
  };

  const sendVoice = async () => {
    let blobFile = await fetch(mediaBlobUrl).then((r) => r.blob());
    const audio = new File([blobFile], "selectedFile", { type: blobFile.type });

    console.log(audio);
    console.log(selectedChat._id);
    setSelectedFile(audio);

    if (mediaBlobUrl) {
      try {
        const { token } = JSON.parse(localStorage.getItem("userInfo"));
        const { data } = await axios.post(
          "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/message",
          { selcetedFile, chatId: selectedChat._id },
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(data);

        socket.emit("new message", data);

        setMessages([...messages, data]);
      } catch (error) {
        // toast.error(error.response.data);
        console.log(error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        padding: "5px",
        gap: "10px",
        overflowX: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "black",
      }}
    >
      <Button
        style={{
          backgroundColor: "#111b21",
          color: "green",
        }}
        variant="contained"
        size="small"
        onClick={startRecording}
      >
        Start
      </Button>

      <Button
        style={{
          backgroundColor: "#111b21",
          color: "red",
        }}
        variant="contained"
        size="small"
        onClick={stopRecording}
      >
        Stop
      </Button>

      <div style={{ display: "inline-block", margin: "0 10px" }}>
        <audio
          style={{
            height: "30px",
          }}
          src={mediaBlobUrl}
          controls
          autoPlay
          loop
        />
      </div>

      <DeleteIcon
        style={{
          color: "white",
          cursor: "pointer",
        }}
        onClick={() => handleDelete()}
      />
      <SendIcon
        onClick={sendVoice}
        style={{ color: "white", cursor: "pointer" }}
      />
    </div>
  );
};

export default Audio;
