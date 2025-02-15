import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { LoginContext } from "./Context/LoginContext";
import { Navigate } from "react-router-dom";
import Home from "./components/Home";
import LoginSignup from "./Login-SignUp/LoginSignup";
import { TherapyRoom } from "./components/TherapyRoom";

const ProtectedRoute = ({ element }) => {
  const { isLoggedIn } = useContext(LoginContext);
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const AllRoutes = () => {
  const { isLoggedIn } = useContext(LoginContext);

  return (
    <Routes>
      <Route path="/" element={isLoggedIn ? <Navigate to="/main" /> : <Home />} />
      <Route path="/login" element={<LoginSignup />} />
      <Route path="/main" element= {<TherapyRoom />} />
    </Routes>
  );
};

export default AllRoutes;
