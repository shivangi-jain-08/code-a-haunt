const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
    Name: {type:String,required: [true, "Please add a Name"]},
    Email: {type:String,unique:[true,"Email is already taken"],required: [true, "Please add a Email"],match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']},
    TherapyHistory: [{type: mongoose.Schema.Types.ObjectId,ref: "therapydatas"}],
    Username: {type:String,required: [true, "Please add a Username"],unique:[true,"Username is already taken"]},
})

const UserDataModel = mongoose.model("userdatas",UserDataSchema)

module.exports = UserDataModel;