import Chat from "../components/chat/Chat";
import ChatProvider from "../context/ChatProvider";

const ChatsPage = () => {
  return (
    <>
      <ChatProvider>
        <Chat />
      </ChatProvider>
    </>
  );
};

export default ChatsPage;
