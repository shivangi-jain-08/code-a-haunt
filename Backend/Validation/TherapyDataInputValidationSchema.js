const Joi = require("joi")

const TherapyDataInputValidationSchema = Joi.object({
    inputProblem: Joi.string().min(100).required(),
    approach: Joi.string().valid(
        "Person Centered Therapy",
        "Mindfulness Based Therapy",
        "Solution Focused Brief Therapy"
    ).required(),
    therapist: Joi.string().valid(
        "Leo",
        "Clara"
    ).required(),
    username: Joi.string().required()
})

module.exports = TherapyDataInputValidationSchema