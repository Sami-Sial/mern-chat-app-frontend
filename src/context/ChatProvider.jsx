import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext(null);

const ChatProvider = (props) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [videoCall, setVideoCall] = useState(undefined);
  const [voiceCall, setVoiceCall] = useState(undefined);
  const [endCall, setEndCall] = useState(undefined);
  const [incomingVideoCall, setIncomingVideoCall] = useState(undefined);
  const [incomingVoiceCall, setIncomingVoiceCall] = useState(undefined);

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo?.user);

    if (!userInfo) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        voiceCall,
        setVoiceCall,
        videoCall,
        setVideoCall,
        endCall,
        setEndCall,
        incomingVideoCall,
        setIncomingVideoCall,
        incomingVoiceCall,
        setIncomingVoiceCall,
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
