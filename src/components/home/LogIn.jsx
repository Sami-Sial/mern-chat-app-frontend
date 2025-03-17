import { useState } from "react";
import "./stylesheets/signup-login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LogIn = () => {
  const navigate = useNavigate();

  const [showPassword, setshowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email and password are required.");
    }

    const formData = { email, password };

    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/user/login",
        { ...formData },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log(data);

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats");
      toast.success("Login successfull. Welcome!!");
    } catch (error) {
      console.log(error.response?.data, error.message);
      toast.error(error.response.data);
    }

    setLoading(false);
  };

  return (
    <>
      <form action="">
        <div className="input-group">
          <label htmlFor="loginEmail">
            Email <b style={{ color: "red" }}>*</b>
          </label>
          <br />
          <input
            type="email"
            id="loginEmail"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="loginPassword">
            Password <b style={{ color: "red" }}>*</b>
          </label>
          <br />
          <input
            type={showPassword ? "text" : "password"}
            id="loginPassword"
            placeholder="Enter your Passowrd"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button onClick={loginSubmit}>Login</button>
      </form>
    </>
  );
};

export default LogIn;
