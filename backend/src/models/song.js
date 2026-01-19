const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        artist: {
            type: String,
            required: true,
            // trim: true,
        },
        artistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        album: {
            type: String,
            default: "",
            trim: true,
        },
        genre: {
            type: String,
            default: "",
            trim: true,
        },
        songUrl: {
            type: String,
            required: true,
            trim: true,
        },
        coverImageUrl: {
            type: String,
            default: "",
            trim: true,
        },
        duration: {
            type: String,
            required: true,
        },
        uploadDate: {
            type: Date,
            default: Date.now,
        },
        approved: {
            type: Boolean,
            default: false,
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        approvedDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);

module.exports = Song;