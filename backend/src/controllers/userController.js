const User = require("../models/user");
const Song = require("../models/song");
const bcrypt = require("bcrypt");
const supabase = require("../../config/supabase");

const getMyProfile = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const user = await User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMyProfile = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;

        if (req.files && req.files.profilePicture) {
            const file = req.files.profilePicture;
            const fileName = `avatars/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;

            const { data, error: uploadError } = await supabase.storage
                .from("cover")
                .upload(fileName, file.data, {
                    contentType: file.mimetype,
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from("cover").getPublicUrl(fileName);
            user.profilePictureUrl = urlData.publicUrl;
        }

        if (password && password.trim() !== "") {
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

        if (user.role === "admin" && (!req.user || req.user.role !== "admin")) {
            return res.status(403).json({ message: "Access denied. Admin profiles are private." });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const uploadSong = async (req, res) => {
    try {
        const { title, artist, album, genre, duration } = req.body;
        const uploaderId = req.user._id;

        if (!req.files || !req.files.song || !req.files.cover) {
            return res.status(400).json({ message: "Song file and cover image are required" });
        }

        const songFile = req.files.song;
        const coverFile = req.files.cover;

        const songFileName = `${Date.now()}_${songFile.name.replace(/\s+/g, '_')}`;
        await supabase.storage
            .from("music")
            .upload(songFileName, new Uint8Array(songFile.data), {
                contentType: songFile.mimetype,
                upsert: true,
            });

        const coverFileName = `${Date.now()}_${coverFile.name.replace(/\s+/g, '_')}`;
        await supabase.storage
            .from("cover")
            .upload(coverFileName, new Uint8Array(coverFile.data), {
                contentType: coverFile.mimetype,
                upsert: true,
            });

        const songUrl = supabase.storage.from("music").getPublicUrl(songFileName).data.publicUrl;
        const coverUrl = supabase.storage.from("cover").getPublicUrl(coverFileName).data.publicUrl;

        const isApproved = req.user.role === "admin";

        const song = await Song.create({
            title: title,
            artist: artist,
            artistId: uploaderId,
            album: album || "",
            genre: genre || "",
            duration: duration,
            songUrl: songUrl,
            coverImageUrl: coverUrl,
            approved: isApproved,
        });

        res.status(201).json({ message: "Upload successful", song });
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