const { getTherapyContext,updateTherapyContext } = require("../AIModules/getContext");
const UserDataModel = require("../Schema/UserSchema");
const TherapyDataInputValidationSchema = require("../Validation/TherapyDataInputValidationSchema");
const TherapyDataModel = require("./../Schema/TherapySchema");

const getAllTherapySessions = async (req, res) => {
  try {
    const TherapySessions = await TherapyDataModel.find({});
    if (TherapySessions.length == 0) {
      return res.status(404).json({ message: "No Therapy Sessions Found" });
    } else {
      return res.status(200).json({
        message: `${TherapySessions.length} Therapy Sessions found.`,
        TherapySessions,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to get any Therapy Sessions", Error: error });
  }
};

const getTherapySessionById = async (req, res) => {
  try {
    const id = req.params.id;
    const therapySession = await TherapyDataModel.findById(id);
    if (!therapySession) {
      return res.status(404).json({ message: "No Therapy Session Found" });
    } else {
      return res.status(200).json({
        message: `Found Therapy Session with id ${id}`,
        TherapySession: therapySession,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Unable to get Therapy Sessions", error });
  }
};

const createTherapySession = async (req, res) => {
  try {
    const { inputProblem, approach, therapist, username } = req.body;

    const { error, value } = TherapyDataInputValidationSchema.validate(
      {
        inputProblem,
        approach,
        therapist,
        username,
      },
      { abortEarly: false }
    );

    if (error) {
      const allErrors = error.details.map((e) => e.message);
      return res.status(400).json({ error: allErrors[0] });
    } else {
      const userResponse = await UserDataModel.find({ Username: username });
      const user = userResponse[0];
      if (!user) {
        return res.status(400).json({ message: "Invalid Username" });
      }else{

          const response = await getTherapyContext(inputProblem, approach);
          const postTherapySession = await TherapyDataModel.create({
            UserProblem: response.UserProblem,
            UserSolution: response.UserSolution,
            Approach: approach,
            Therapist: therapist,
            ChatHistory: null,
            UserId: user._id
          })
          const updatedUser = await UserDataModel.findOneAndUpdate(

            {Username: username},
            {TherapyHistory: [postTherapySession._id,...user.TherapyHistory]}
          )

          return res.status(201).json({
            message: "Therapy Session Created",
            createdTherapySession: postTherapySession,
            user: updatedUser
          })
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to create Therapy Session." });
  }
};
const updateTherapyContextController = async (req,res) => {
  try{
    const id = req.params.id;
    const therapySession = await TherapyDataModel.findById(id);
    if (!therapySession) {
      return res.status(404).json({ message: "No Therapy Session Found" });
    }else{
      const updatedTherapyContext = await updateTherapyContext(therapySession.UserProblem,therapySession.UserSolution,therapySession.ChatHistory)
      const updatedTherapySession = await TherapyDataModel.findByIdAndUpdate(id,{
        UserProblem: updatedTherapyContext.UserProblem,
        UserSolution: updatedTherapyContext.UserSolution
      })

      return res
        .status(200)
        .json({
          message: "THerapy Successfully Updated",
          updatedTherapySession
        });
    }
  }catch(error){
    console.log(error);
    return res
      .status(500)
      .json({ message: "Unable to update Therapy Sessions", error });
  }
}

const updateTherapyChatHistory = async (req,res)=>{
  try {
    const id = req.params.id;
    const chatHistory = req.body.chatHistory;
    const therapySession = await TherapyDataModel.findById(id);
    if (!therapySession) {
      return res.status(404).json({ message: "No Therapy Session Found" });
    }else{
      const updatedChatHistory = await UserDataModel.findByIdAndUpdate(id,{
        ChatHistory: chatHistory
      })
    }
  } catch (error) {
    
  }
}

module.exports = {
  getAllTherapySessions,
  getTherapySessionById,
  createTherapySession,
  updateTherapyContextController,
  updateTherapyChatHistory
};
