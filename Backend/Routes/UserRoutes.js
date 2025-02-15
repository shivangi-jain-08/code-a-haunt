const express = require("express");

const {getAllUsers,getUserByUserId} = require("./../Controller/UserDataController")

const UserRoutes = express.Router();

UserRoutes.get("/",getAllUsers)
UserRoutes.get("/:id",getUserByUserId)



module.exports = UserRoutes;
