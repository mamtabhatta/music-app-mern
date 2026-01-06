const User = require("../models/user");
const Song = require("../models/song");
const bcrypt = require("bcrypt");
const supabase = require("../../config/supabase");

const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const { name, email, password, profilePictureUrl } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (profilePictureUrl) user.profilePictureUrl = profilePictureUrl;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.json({
            message: "Profile updated successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePictureUrl: user.profilePictureUrl,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.role === "admin" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. Admin profiles are private." });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadSong = async (req, res) => {
    try {
        const { title, album, genre, duration } = req.body;
        const artistId = req.user._id;

        if (!req.files || !req.files.song || !req.files.cover) {
            return res.status(400).json({ message: "Song file and cover image are required" });
        }

        const songFile = req.files.song;
        const coverFile = req.files.cover;

        const { data: songData, error: songError } = await supabase.storage
            .from("music")
            .upload(`${Date.now()}_${songFile.name}`, songFile.data, {
                contentType: songFile.mimetype,
                upsert: true,
            });
        if (songError) throw songError;
        const songUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/music/${songData.path}`;

        const { data: coverData, error: coverError } = await supabase.storage
            .from("cover")
            .upload(`${Date.now()}_${coverFile.name}`, coverFile.data, {
                contentType: coverFile.mimetype,
                upsert: true,
            });
        if (coverError) throw coverError;
        const coverUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/cover/${coverData.path}`;

        const approved = req.user.role === "admin";

        const song = await Song.create({
            title,
            album: album || "",
            genre: genre || "",
            duration,
            artistId,
            songUrl,
            coverImageUrl: coverUrl,
            approved,
        });

        const message = approved
            ? "Song uploaded and automatically approved (admin)"
            : "Song uploaded, pending admin approval";

        res.status(201).json({ message, song });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMyProfile,
    updateMyProfile,
    getUserById,
    uploadSong,
};