const express = require("express");

const {getAllUsers,getUserByUserId,createUser, getInWithGoogle, loginUser, verifyOTP} = require("./../Controller/UserDataController")

const UserRoutes = express.Router();

UserRoutes.get("/",getAllUsers)
UserRoutes.get("/:id",getUserByUserId)
UserRoutes.post("/signup", createUser);
UserRoutes.post("/google-auth", getInWithGoogle)
UserRoutes.post("/login", loginUser);

UserRoutes.post('/verify', verifyOTP);


module.exports = UserRoutes;
