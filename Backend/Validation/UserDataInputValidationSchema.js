const Joi = require("joi");


const UserDataInputValidationSchema = Joi.object({
    Name: Joi.string().required().min(4),
    Email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','in','community'] } }),
    Password: Joi.string().required().min(10),
    Username: Joi.string().required()
})

module.exports = UserDataInputValidationSchema;