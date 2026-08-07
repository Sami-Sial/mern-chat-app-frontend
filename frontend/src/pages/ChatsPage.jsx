import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import { useEffect } from "react";
import Chat from "../components/chat/Chat";

const ChatsPage = () => {
  const { user } = ChatState();
  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/auth");
    }
  }, [navigate]);

  return (
    <div style={{ height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", width: "100%", zIndex: 0, boxSizing: "border-box", backgroundColor: "transparent" }}>
      <Chat />
    </div>
  );
};

export default ChatsPage;
