import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Preview from "../pages/Preview";
const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const ChatContext = createContext(null);

const ChatProvider = (props) => {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const [videoCall, setVideoCall] = useState(undefined);
  const [voiceCall, setVoiceCall] = useState(undefined);
  const [endCall, setEndCall] = useState(undefined);
  const [incomingVideoCall, setIncomingVideoCall] = useState(undefined);
  const [incomingVoiceCall, setIncomingVoiceCall] = useState(undefined);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo && userInfo.token) {
      const getLoggedInUserInfo = async () => {
        try {
          const res = await axios.get(`${BACKEND_BASE_URL}/api/user/me`, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          setUser(res.data.user);
        } catch (error) {
          console.log(error);

          // Network error (No internet, server down, CORS issue)
          if (error.message === "Network Error" || !error.response) {
            return toast.error("Network error — Please check your internet connection.");
          }

          // Token expired (JWT)
          if (error.response?.data?.name === "TokenExpiredError") {
            localStorage.removeItem("userInfo");
            return toast.error("Session expired. Please login again.");
          }

          // API error message from server
          const msg =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Something went wrong";

          return toast.error(msg);
        }
        finally {
          setLoading(false)
        }
      };

      getLoggedInUserInfo();
    }
    else {
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
  }, [user]);

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
      {loading ? <Preview /> : props.children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
