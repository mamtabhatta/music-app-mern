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
        song.approved = true;
        song.approvedBy = req.user._id;
        song.approvedDate = Date.now();
        await song.save();
        await AdminAction.create({
            adminId: req.user._id,
            targetType: "song",
            targetId: song._id,
            actionType: "approve",
            reason: "Approved by admin",
        });
        res.json({ message: "Song approved successfully", song });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeSong = async (req, res) => {
    try {
        const { songId } = req.params;
        const song = await Song.findById(songId);
        if (!song) return res.status(404).json({ message: "Song not found" });
        if (song.songUrl) {
            const songPath = song.songUrl.split("/songs/")[1];
            await supabase.storage.from("songs").remove([`songs/${songPath}`]);
        }
        if (song.coverImageUrl) {
            const coverPath = song.coverImageUrl.split("/covers/")[1];
            await supabase.storage.from("covers").remove([`covers/${coverPath}`]);
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