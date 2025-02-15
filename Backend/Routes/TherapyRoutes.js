const express = require("express");
const {getAllTherapySessions,getTherapySessionById,createTherapySession} = require("./../Controller/TherapyDataController")
const TherapyRoutes = express.Router();

TherapyRoutes.get("/",getAllTherapySessions)
TherapyRoutes.get("/:id",getTherapySessionById)
TherapyRoutes.post("/",createTherapySession)



module.exports = TherapyRoutes
