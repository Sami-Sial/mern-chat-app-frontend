import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import { useEffect } from "react";
import Chat from "../components/chat/Chat";

const ChatsPage = () => {
  const { user } = ChatState();
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <Chat />
    </>
  );
};

export default ChatsPage;
