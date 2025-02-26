const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connect = require("./config/connect");
const UserRoutes = require("./Routes/UserRoutes");
const TherapyRoutes = require("./Routes/TherapyRoutes");
const {
  getRefinedData,
  getRefinedUserDetail,
} = require("./AIModules/getRefinement");
const port = process.env.PORT || 5001;
const app = express();
app.use(express.json());
app.use(cors());

app.route("/").get((req, res) => {
  res.send("This is MindMate AI Backend Route");
});

const sampleUserInput = {
  majorIssues: "Anxiety, stress due to work pressure",
  recentSymptoms: "Feeling restless, trouble sleeping at night",
  relationships: {
    family: "Arguments with parents, lack of emotional support",
    friends: "Feels distant from close friends, limited social interactions",
    romantic: "Breakup recently, trust issues",
  },
  career: {
    profession: "Software Developer",
    stressLevel: "High",
    jobSatisfaction: "Neutral",
  },
  triggers: "High workload, social gatherings, personal expectations",
  copingMechanisms: "Listening to music, deep breathing, isolation",
  supportSystem: {
    family: false,
    friends: true,
    therapist: false,
  },
  medicalHistory: {
    pastDiagnoses: "Mild depression diagnosed in college",
    medications: "None",
  },
  familyHistory: "Father has anxiety disorder, grandmother had depression",
  lifestyle: {
    sleepHours: 5,
    dietQuality: "Average",
    exerciseFrequency: "Rarely",
    substanceUse: "Occasional",
  },
  therapeuticGoals: "Improve focus, reduce anxiety attacks",
  age: 28,
  gender: "Male",
  sex: "Male",
};
// getRefinedUserDetail(sampleUserInput)
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

connect()
  .then((response) => {
    console.log(response);
    app.get("/", (req, res) => {
      res.send(response);
    });
  })
  .catch((response) => {
    console.log(response);
    app.get("/", (req, res) => {
      res.send(response);
    });
  });

app.use("/api/userdatas", UserRoutes);
app.use("/api/therapydatas", TherapyRoutes);

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
