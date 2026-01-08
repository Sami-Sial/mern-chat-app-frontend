import { useState } from "react";
import "./stylesheets/signup-login.css";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Eye, EyeOff } from "lucide-react"; // 👈 Import icons
import { ChatState } from "../../context/ChatProvider";
const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const LogIn = () => {
  const navigate = useNavigate();
  const { setUser } = ChatState();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const loginSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email and password are required.");
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_BASE_URL}/api/user/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(data);

      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Login successful. Welcome!!");
      setUser(data.user);
      navigate("/chats");

    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={loginSubmit}>
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

      <div className="input-group " style={{ position: "relative" }}>
        <label htmlFor="loginPassword">
          Password <b style={{ color: "red" }}>*</b>
        </label>
        <br />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="loginPassword"
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            className="password-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? <CircularProgress size={25} color="inherit" /> : "Login"}
      </button>
    </form>
  );
};

export default LogIn;
