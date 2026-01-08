import { useState } from "react";
import "./stylesheets/signup-login.css";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"; // 👁️ using lucide-react icons
import { ChatState } from "../../context/ChatProvider";
const BACKEND_BASE_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_DEV_BACKEND_BASE_URL
    : import.meta.env.VITE_PROD_BACKEND_BASE_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const { setUser } = ChatState()

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Password regex: 1 uppercase, 1 lowercase, 1 digit, min 6 chars
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&^#()\-_=+{}[\]|:;"'<>,.~]{6,15}$/;

  const registerSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !pic) {
      return toast.error("All fields with * are mandatory.");
    } else if (!passwordRegex.test(password)) {
      return toast.error(
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 6-15 characters long."
      );
    } else if (password !== confirmPassword) {
      return toast.error("Password and confirm password do not match.");
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("pic", pic);

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${BACKEND_BASE_URL}/api/user/signup`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Signup successful. Welcome!!");
      setUser(data.user);
      navigate("/chats");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={registerSubmit} className="signup-form">
      <div className="input-group">
        <label htmlFor="name">
          Name <b style={{ color: "red" }}>*</b>
        </label>
        <br />
        <input
          type="text"
          id="name"
          placeholder="Enter your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="email">
          Email <b style={{ color: "red" }}>*</b>
        </label>
        <br />
        <input
          type="email"
          id="email"
          placeholder="Enter your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {/* Password Field */}
      <div className="input-group password-field">
        <label htmlFor="password">
          Password <b style={{ color: "red" }}>*</b>
        </label>
        <br />
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
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

      {/* Confirm Password Field */}
      <div className="input-group password-field">
        <label htmlFor="confirmPassword">
          Confirm Password <b style={{ color: "red" }}>*</b>
        </label>
        <br />
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            placeholder="Re-enter your Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            className="password-icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>
      </div>

      <div className="input-group">
        <label htmlFor="pic">
          Profile Picture <b style={{ color: "red" }}>*</b>
        </label>
        <br />
        <input
          type="file"
          accept="image/*"
          id="pic"
          onChange={(e) => setPic(e.target.files[0])}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? (
          <div className="btn-loader">
            <Loader size={25} color="inherit" />
          </div>
        ) : (
          "Register"
        )}
      </button>
    </form>
  );
};

export default SignUp;
