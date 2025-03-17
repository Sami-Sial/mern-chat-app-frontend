import { useState } from "react";
import "./stylesheets/signup-login.css";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const registerSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("All fields with * are mandatory.");
    } else if (password !== confirmPassword) {
      return toast.error("Password and confirm password are not matching");
    }

    const formData = { name, email, password, pic };

    try {
      setLoading(true);
      const { data } = await axios.post(
        "https://moderate-patricia-mern-chat-app-7096ee1a.koyeb.app/api/user/signup",
        { ...formData },
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log(data);

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats");
      toast.success("Signup successfull. Welcome!!");
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data);
    }

    setLoading(false);
  };

  return (
    <>
      <form action="">
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

        <div className="input-group">
          <label htmlFor="password">
            Password <b style={{ color: "red" }}>*</b>
          </label>
          <br />
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="confirmPassword">
            Confirm Password <b style={{ color: "red" }}>*</b>
          </label>
          <br />
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="pic">Profile Pic</label>
          <br />
          <input
            type="file"
            accept="image/*"
            id="pic"
            onChange={(e) => setPic(e.target.files[0])}
          />
        </div>

        <button onClick={registerSubmit}>Register</button>
      </form>
    </>
  );
};

export default SignUp;
