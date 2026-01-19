const Joi = require("joi");

const uploadSongValidation = Joi.object({
    title: Joi.string().min(1).max(100).required(),
    artist: Joi.string().min(1).max(100).required(),
    album: Joi.string().max(100).allow(""),
    genre: Joi.string().max(50).allow(""),
    duration: Joi.string().required(),
    artistId: Joi.string().length(24).hex().optional(),
});

module.exports = { uploadSongValidation };