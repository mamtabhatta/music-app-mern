import Song from "../models/song.js";
import User from "../models/user.js";
import supabase from "../../config/supabase.js";

const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find({ approved: true });
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadSong = async (req, res) => {
    try {
        const { title, artist, album, genre, duration } = req.body;
        const uploaderId = req.user._id;

        // Function to handle "3:45" strings or raw numbers
        const parseDuration = (val) => {
            if (!val) return 0;
            if (typeof val === 'string' && val.includes(':')) {
                const [m, s] = val.split(':').map(Number);
                return (m * 60) + (s || 0);
            }
            return parseInt(val) || 0;
        };

        if (!req.files || !req.files.song || !req.files.cover) {
            return res.status(400).json({ message: "Song and cover required" });
        }

        const songFile = req.files.song;
        const coverFile = req.files.cover;

        const songFileName = `${Date.now()}_${songFile.name.replace(/\s+/g, '_')}`;
        const coverFileName = `${Date.now()}_${coverFile.name.replace(/\s+/g, '_')}`;

        const { error: songError } = await supabase.storage
            .from("music")
            .upload(songFileName, songFile.data, { contentType: songFile.mimetype });

        if (songError) throw songError;

        const { error: coverError } = await supabase.storage
            .from("cover")
            .upload(coverFileName, coverFile.data, { contentType: coverFile.mimetype });

        if (coverError) throw coverError;

        const songUrl = supabase.storage.from("music").getPublicUrl(songFileName).data.publicUrl;
        const coverUrl = supabase.storage.from("cover").getPublicUrl(coverFileName).data.publicUrl;

        const song = await Song.create({
            title,
            artist,
            artistId: uploaderId,
            album: album || "",
            genre,
            duration: parseDuration(duration),
            songUrl,
            coverImageUrl: coverUrl,
            approved: req.user.role === "admin",
            isPublic: req.user.role === "admin"
        });

        res.status(201).json({ message: "Upload successful", song });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user._id, req.body, { new: true }).select("-password");
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getAllSongs,
    uploadSong,
    getMyProfile,
    updateMyProfile,
    getUserById
};