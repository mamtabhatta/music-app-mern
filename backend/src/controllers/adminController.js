const Song = require("../models/song");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const AdminAction = require("../models/adminAction");
const supabase = require("../../config/supabase");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select("-password");
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingSongs = async (req, res) => {
    try {
        const pendingSongs = await Song.find({ approved: { $ne: true } });
        res.json({ pendingSongs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveSong = async (req, res) => {
    try {
        const { songId } = req.params;
        const song = await Song.findById(songId);
        if (!song) return res.status(404).json({ message: "Song not found" });

        // 1. Mark as approved in MongoDB
        song.approved = true;
        await song.save();

        // 2. THIS IS THE MISSING STEP: Insert into Supabase Table Editor
        const { error: supabaseError } = await supabase
            .from("songs") // Make sure this matches your table name exactly
            .insert([
                {
                    title: song.title,
                    artist: song.artistId.toString(),
                    genre: song.genre,
                    duration: parseInt(song.duration) || 0,
                    audioUrl: song.songUrl,
                    imageUrl: song.coverImageUrl,
                    approved: true
                }
            ]);

        if (supabaseError) {
            console.error("Supabase SQL Sync Error:", supabaseError);
            return res.status(500).json({ message: "Failed to sync to Supabase Table", error: supabaseError });
        }

        res.json({ message: "Song approved and added to Supabase Table!", song });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeSong = async (req, res) => {
    try {
        const { songId } = req.params;
        const song = await Song.findById(songId);
        if (!song) return res.status(404).json({ message: "Song not found" });

        // Remove from Supabase Table Editor if it exists there
        await supabase.from("songs").delete().eq("title", song.title);

        if (song.songUrl) {
            const songPath = song.songUrl.split("/music/")[1]; // Changed from /songs/ to match your bucket
            await supabase.storage.from("music").remove([songPath]);
        }
        if (song.coverImageUrl) {
            const coverPath = song.coverImageUrl.split("/cover/")[1]; // Changed from /covers/ to match your bucket
            await supabase.storage.from("cover").remove([coverPath]);
        }

        await Song.findByIdAndDelete(songId);
        await AdminAction.create({
            adminId: req.user._id,
            targetType: "song",
            targetId: song._id,
            actionType: "remove",
            reason: req.body?.reason || "Removed by admin",
        });
        res.json({ message: "Song removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });
        await User.findByIdAndDelete(userId);
        await AdminAction.create({
            adminId: req.user._id,
            targetType: "user",
            targetId: user._id,
            actionType: "remove",
            reason: req.body?.reason || "Removed by admin",
        });
        res.json({ message: "User removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });
        await Post.findByIdAndDelete(postId);
        await AdminAction.create({
            adminId: req.user._id,
            targetType: "post",
            targetId: post._id,
            actionType: "remove",
            reason: req.body?.reason || "Removed by admin",
        });
        res.json({ message: "Post removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const comment = await Comment.findById(commentId);
        if (!comment) return res.status(404).json({ message: "Comment not found" });
        await Comment.findByIdAndDelete(commentId);
        await AdminAction.create({
            adminId: req.user._id,
            targetType: "comment",
            targetId: comment._id,
            actionType: "remove",
            reason: req.body?.reason || "Removed by admin",
        });
        res.json({ message: "Comment removed by admin successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    getPendingSongs,
    approveSong,
    removeSong,
    removeUser,
    removePost,
    removeComment
};