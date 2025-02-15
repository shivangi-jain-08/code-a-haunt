import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import axios from "../axiosConfig";
import { LoginContext } from "../Context/LoginContext";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { WindowWidthContext } from "../Context/WindowWidthContext";

const Login = () => {
  const url = import.meta.env.VITE_API_URL;
  const { setIsLoggedIn, setCurrUser } = useContext(LoginContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/users/login`, {
        username,
        password,
      });
      // localStorage.setItem("token", response.data.token); // Save token
      console.log("response: ", response);
      Cookies.set("token", response.data.token, { expires: 7, path: "/" });
      Cookies.set("user", JSON.stringify(response.data.data), {
        expires: 7,
        path: "/",
      });
      setCurrUser(response.data.data);
      toast.success(response.data.message, {
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
      console.log("Error:", error.response.data.message);
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

  return (
    <>
      <div>
        <form onSubmit={handleLogin} className="ls-form">
          <div className="form-fields">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User Name"
              className="form-input"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="username" className="form-label">
              UserName
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password" className="form-label">
              Password
            </label>
          </div>
          <button
            type="submit"
            value="LOGIN"
            styles={{ fontSize: "16px", marginTop: "8px" }}
          />
        </form>
      </div>
    </>
  );
};

export default Login;
