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
          const globalContext = user.UserDetails;
          const response = await getTherapyContext(globalContext,inputProblem, approach);
          const postTherapySession = await TherapyDataModel.create({
            UserProblem: response.UserProblem,
            UserSolution: response.UserSolution,
            Approach: approach,
            Therapist: therapist,
            ChatHistory: [],
            UserId: user._id
          })
          await UserDataModel.findOneAndUpdate(

            {Username: username},
            {TherapyHistory: [postTherapySession._id,...user.TherapyHistory]}
          )
          const updatedUser = await UserDataModel.findOne({Username: username})

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
      const updatedTherapyContext = await updateTherapyContext(therapySession.UserProblem,therapySession.UserSolution,req.body.ChatHistory)
      const updatedTherapySession = await TherapyDataModel.findByIdAndUpdate(id,{
        UserProblem: updatedTherapyContext.UserProblem,
        UserSolution: updatedTherapyContext.UserSolution,
        ChatHistory: req.body.ChatHistory
      })

      return res
        .status(200)
        .json({
          message: "Therapy Successfully Updated",
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

const getContextController = async(req,res)=>{
  try {
    const response = await getTherapyContext(req.body.globalContext,req.body.input, req.body.approach);
    return res.status(201).json({
      context: response
    })

  } catch (error) {
    return res.status(500).json({
      error: error
    })
  }
}

const deleteTherapySession = async (req, res) => {
  try {
      const deletedTherapySession = await TherapyDataModel.findByIdAndDelete(req.params.id)

      if(!deletedTherapySession){
          return res.status(404).json({message: "Unable to find the Therapy Sessions"})
      }else{
        const userid = deletedTherapySession.UserId
          const user = await UserDataModel.findById(userid)
          const updatedPresentationsArr = user.TherapyHistory.filter(e=> !e.equals(deletedTherapySession._id))
          const updatedUser = await UserDataModel.findByIdAndUpdate(userid,{TherapyHistory: updatedPresentationsArr},{new: true})
          return res.status(200).json({message: "User deleted Successfully",DeletedTherapySession: deletedTherapySession,UpdatedUser: updatedUser})
      }
  } catch (error) {
    return res
    .status(500)
    .json({ message: "Unable to Delete the Therapy Session", Error: error });
  }
};


module.exports = {
  getAllTherapySessions,
  getTherapySessionById,
  createTherapySession,
  updateTherapyContextController,
  getContextController,
  deleteTherapySession
};
