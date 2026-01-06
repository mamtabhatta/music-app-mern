// album.js
const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    artist: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "", trim: true },
    releaseYear: { type: Number },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
}, { timestamps: true });

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
