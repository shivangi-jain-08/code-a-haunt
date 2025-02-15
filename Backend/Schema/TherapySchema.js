const mongoose = require('mongoose');

const ChatHistorySchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user', 'assistant'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
},
);
const TherapySessionSchema = new mongoose.Schema({
    UserProblem: {
        type: String,
        required: true
    },
    UserSolution: {
        type: String,
        required: true
    },
    Approach: {
        type: String,
        required: true
    },
    Therapist: {
        type: String,
        required: true
    },
    ChatHistory: [ChatHistorySchema],
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userdatas',
        required: true
    },
}
);

const TherapyDataModel = mongoose.model("therapydatas",TherapySessionSchema)

module.exports = TherapyDataModel;
