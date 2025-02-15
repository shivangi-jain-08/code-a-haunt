import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoginContext } from "../Context/LoginContext";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const SignUp = () => {
  const url = import.meta.env.VITE_API_URL;
  const { isLoggedIn, setIsLoggedIn, currUser, setCurrUser } =
    useContext(LoginContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });

  const [isOTPMode, setIsOTPMode] = useState(false);
  const [email, setEmail] = useState(null);
  const [otp, setOtp] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/users/signup`, formData);
      setEmail(response.data.data.email);
      setIsOTPMode(true);
      toast.success("OTP sent to your email. Please verify.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/users/verify`, {
        email,
        otp,
      });
      Cookies.set("token", response.data.token, { expires: 7, path: "/" });
      Cookies.set("user", JSON.stringify(response.data.data), {
        expires: 7,
        path: "/",
      });
      setCurrUser(response.data.data);
      toast.success("OTP verified successfully.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        onClose: () => {
          setIsLoggedIn(true);
          navigate("/");
        },
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOTPChange = (e) => {
    setOtp(e.target.value);
  };

  return (
    <div>
      {isOTPMode ? (
        <form onSubmit={handleOTPVerification} className="otp-form">
          <div className="form-fields">
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter OTP"
              className="form-input"
              required
              value={otp}
              onChange={handleOTPChange}
            />
            <label htmlFor="otp" className="form-label">
              OTP
            </label>
          </div>
          <FilledBtn
            value="VERIFY OTP"
            styles={{ fontSize: "16px", margin: "20px auto" }}
          />
        </form>
      ) : (
        <form onSubmit={handleSignUp} className="ls-form">
          <div className="form-fields">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User Name"
              className="form-input"
              required
              value={formData.username}
              onChange={handleChange}
            />
            <label htmlFor="username" className="form-label">
              UserName
            </label>
          </div>
          <div className="form-fields">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              className="form-input"
              required
              value={formData.name}
              onChange={handleChange}
            />
            <label htmlFor="name" className="form-label">
              Name
            </label>
          </div>
          <div className="form-fields">
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              className="form-input"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label htmlFor="email" className="form-label">
              Email
            </label>
          </div>
          <div className="form-fields">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="form-input"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label htmlFor="password" className="form-label">
              Password
            </label>
          </div>
          <button
            value="REGISTER"
            styles={{ fontSize: "16px", marginTop: "8px" }}
          />
        </form>
      )}
    </div>
  );
};

export default SignUp;
