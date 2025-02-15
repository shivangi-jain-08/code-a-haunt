const express = require("express");
const {getAllTherapySessions,getTherapySessionById,createTherapySession,updateTherapyContext,updateTherapyChatHistory} = require("./../Controller/TherapyDataController")
const TherapyRoutes = express.Router();

TherapyRoutes.get("/",getAllTherapySessions)
TherapyRoutes.get("/:id",getTherapySessionById)
TherapyRoutes.post("/",createTherapySession)
TherapyRoutes.patch("/updateContext/:id",updateTherapyContext)
TherapyRoutes.patch("/updateChatHistory/:id",updateTherapyChatHistory)



module.exports = TherapyRoutes
