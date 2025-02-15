import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const LoginContext = createContext();

const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = Cookies.get("token");
    return token ? true : false;
  });
  const [currUser, setCurrUser] = useState(()=>{
    const user = Cookies.get("user");
    return user ? JSON.parse(user) : null;
  });
  console.log(currUser)

  useEffect(() => {
    const token = Cookies.get("token");
    const user = Cookies.get("user");

    if (token && user) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          setIsLoggedIn(true);
          setCurrUser(JSON.parse(user));
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setIsLoggedIn(false);
    setCurrUser(null);
  };

  return (
    <LoginContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, currUser, setCurrUser, logout }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginProvider;
