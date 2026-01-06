const Joi = require("joi");

const updateProfileValidation = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    profilePictureUrl: Joi.string().uri(),
});

module.exports = { updateProfileValidation };
