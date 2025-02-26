const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const userMentalHealthValidationSchema = require("./../Validation/UserMentalHealthValidationSchema")
const UserDataModel = require("../Schema/UserSchema");
const bcrypt = require('bcrypt');
const { getRefinedUserDetail } = require("../AIModules/getRefinement");
require('dotenv').config();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.WEB_MAILID,
        pass: process.env.WEB_PASS,
    },
});


// Handler to create a user
const createUser = async (req, res) => {
    try {
        const { Username, Name, Email, Password } = req.body;
        const hashedPassword = await bcrypt.hash(Password, 10);
        const user = await UserDataModel.find({ $or: [{ Username: Username }, { Email: Email }] });
        if (user.length === 0) {
            const newUser = new UserDataModel({ Username: Username, Name: Name, Email: Email, Password: hashedPassword,TherapyHistory: [], UserDetails: null });
            const otp = newUser.generateOTP();
            await sendOTPEmail(Email, otp);
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, Username: newUser.Username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(201).json({ message: "User created successfully", token, data: newUser });
        } else {
            res.status(401).json({ message: "User already exists", data: user });
        }
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user" });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { Email, otp } = req.body;
        const user = await UserDataModel.findOne({ Email: Email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.verifyOTP(otp)) {
            user.Verify = true;
            user.Otp = null;
            await user.save();
            res.status(200).json({ message: "OTP verified successfully", data: user });
        } else {
            res.status(401).json({ message: "Invalid OTP" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        res.status(500).json({ message: "Error verifying OTP", error });
    }
};


// Function to send OTP Email
const sendOTPEmail = async (Email, otp) => {
    try {
        const mailOptions = {
            from: process.env.WEB_MAILID,
            to: Email,
            subject: 'OTP Verification',
            html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP Email sent successfully');
        // console.log(`OTP Email sent to ${Email}: ${otp}`);
    } catch (error) {
        console.error('Error sending OTP Email:', error);
        throw error;
    }
};

const loginUser = async (req, res) => {
    try {
        const { Username, Password } = req.body;
        const user = await UserDataModel.findOne({ Username: Username });
        if (user && await bcrypt.compare(Password, user.Password)) {
            const token = jwt.sign({ id: user._id, Username: user.Username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token, data: user });
        } else {
            res.status(401).json({ message: "Invalid Username or Password" });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user", error });
    }
};

const getInWithGoogle = async (req, res) => {
    let { Username, Name, Email, Password } = req.body;
    const hashedPassword = await bcrypt.hash(Password, 10);
    const user = await UserDataModel.find({ $or: [{ Username }, { Email }] });
    if (user.length === 0) {
        const newUser = new UserDataModel({ Username, Name, Email, Password: hashedPassword,TherapyHistory: [], UserDetails: null  });
        await newUser.save()
        const token = jwt.sign({ id: newUser._id, Username: newUser.Username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: "User created successfully", token, data: newUser });
    } else {
        const user = await UserDataModel.findOne({ Username });
        if (user && await bcrypt.compare(Password, user.Password)) {
            const token = jwt.sign({ id: user._id, Username: user.Username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token, data: user });
        } else {
            res.status(401).json({ message: "Try logging in using your Username/Password" });
        }
    }

}

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

const updateUserWithInitialUserDetail = async(req,res)=>{
    try {
      // Validate the request body against the Joi schema
      const { error, value } = userMentalHealthValidationSchema.validate(req.body, { abortEarly: false });
  
      if (error) {
        return res.status(400).json({
          success: false,
          error: "Validation failed",
          details: error.details.map((err) => err.message),
        });
      }
  
      const userResponse = await UserDataModel.findById(req.params.id);
        if (!userResponse) {
          return res.status(400).json({ message: "Invalid Username" });
        }
      // Process the validated data using the refinement function
      const refinedData = await getRefinedUserDetail(value);
      const updatedUser = await UserDataModel.findByIdAndUpdate(req.params.id,{UserDetails: refinedData})
  
      return res.status(200).json({ success: true, refinedData, updatedUser });
  
    } catch (error) {
      console.error("Error in refining user data:", error);
      return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }




module.exports = {getAllUsers,getUserByUserId,verifyOTP, getInWithGoogle, loginUser, createUser,updateUserWithInitialUserDetail}
