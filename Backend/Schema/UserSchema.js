const mongoose = require('mongoose');
const UserDetailSchema = require('./UserDetailSchema');
const { required } = require('joi');
const crypto = require('crypto');


const UserDataSchema = new mongoose.Schema({
    Name: {type:String,required: [true, "Please add a Name"]},
    Email: {type:String,unique:[true,"Email is already taken"],required: [true, "Please add a Email"],match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']},
    TherapyHistory: [{type: mongoose.Schema.Types.ObjectId,ref: "therapydatas"}],
    UserDetails: {type: UserDetailSchema, default: null},
    Username: {type:String,required: [true, "Please add a Username"],unique:[true,"Username is already taken"]},
    Password: {type: String, required: [true,"Please provide a Password"]}
})

UserDataSchema.methods.generateOTP = function () {
    const otp = crypto.randomInt(100000, 999999); // Generates a 6-digit OTP
    this.otp = otp; // Store it in the user document (optional)
    this.otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    return otp.toString();
};

const UserDataModel = mongoose.model("userdatas",UserDataSchema)

module.exports = UserDataModel;