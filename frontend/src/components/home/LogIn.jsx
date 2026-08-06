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
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required for password reset.");
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_BASE_URL}/api/user/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(data.message || "Password reset link generated. Check console.");
      setIsForgotPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to initiate password reset.");
    } finally {
      setLoading(false);
    }
  };

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

  const loginForm = (
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <span 
          style={{ color: 'skyblue', cursor: 'pointer', fontSize: '0.9rem' }}
          onClick={() => setIsForgotPassword(true)}
        >
          Forgot Password?
        </span>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? <CircularProgress size={25} color="inherit" /> : "Login"}
      </button>
    </form>
  );

  return isForgotPassword ? (
    <form onSubmit={handleForgotPassword}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Reset Password</h3>
      <p style={{ textAlign: 'center', fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
        Enter your email to receive a password reset link.
      </p>
      <div className="input-group">
        <label htmlFor="resetEmail">Email <b style={{ color: "red" }}>*</b></label>
        <br />
        <input
          type="email"
          id="resetEmail"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? <CircularProgress size={25} color="inherit" /> : "Send Reset Link"}
      </button>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <span 
          style={{ color: 'skyblue', cursor: 'pointer', fontSize: '0.9rem' }}
          onClick={() => setIsForgotPassword(false)}
        >
          Back to Login
        </span>
      </div>
    </form>
  ) : (
    loginForm
  );
};

export default LogIn;
