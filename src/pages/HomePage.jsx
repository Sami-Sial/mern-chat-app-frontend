import { useEffect } from "react";
import Home from "../components/home/Home";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";

const HomePage = () => {
  const { user } = ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <>
      <Home />
    </>
  );
};

export default HomePage;
