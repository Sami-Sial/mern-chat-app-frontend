import { useEffect } from "react";
import Home from "../components/home/Home";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");

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
