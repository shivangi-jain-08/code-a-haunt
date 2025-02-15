const UserDataModel = require("../Schema/UserSchema");

const getAllUsers = async (req, res) => {
  try {
    const AllUsers = await UserDataModel.find({}).populate("TherapyHistory");
    if (AllUsers.length == 0) {
      return res.status(404).json({ message: "No Users Found" });
    } else {
      return res.status(200).json({
        message: `${AllUsers.length} Users found.`,
        AllUsers,
      });
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).json(error);
  }
};

const getUserByUserId = async (req, res) => {
  try {
    const OneUser = await UserDataModel.findById(req.params.id)
      .populate("TherapyHistory")
    if (!OneUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: `See User for ${req.params.id}`, OneUser });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching single User" });
  }
};





module.exports = {getAllUsers,getUserByUserId}
