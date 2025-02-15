const User = require("../Schema/UserSchema");
const jwt = require('jsonwebtoken');
// const User = require('../models/user');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
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
        const { username, name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.find({ $or: [{ username }, { email }] });
        if (user.length === 0) {
            const newUser = new User({ username, name, email, password: hashedPassword });
            const otp = newUser.generateOTP();
            await sendOTPEmail(email, otp);
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
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
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

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


// Function to send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.WEB_MAILID,
            to: email,
            subject: 'OTP Verification',
            html: `<p>Your OTP for verification is: <strong>${otp}</strong></p>`,
        };

        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
        // console.log(`OTP email sent to ${email}: ${otp}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw error;
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token, data: user });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Error logging in user", error });
    }
};

const getInWithGoogle = async (req, res) => {
    let { username, name, email, password, avatar, Verify } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.find({ $or: [{ username }, { email }] });
    if (user.length === 0) {
        const newUser = new User({ username, name, email, password: hashedPassword, avatar, Verify: Verify || false });
        await newUser.save()
        const token = jwt.sign({ id: newUser._id, username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: "User created successfully", token, data: newUser });
    } else {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token, data: user });
        } else {
            res.status(401).json({ message: "Try logging in using your Username/Password" });
        }
    }

}

const getAllUsers = async (req, res) => {
  try {
    const AllUsers = await User.find({}).populate("TherapyHistory");
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
    const OneUser = await User.findById(req.params.id)
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





module.exports = {getAllUsers,getUserByUserId,verifyOTP, getInWithGoogle, loginUser, createUser}
