const Follow = require("../models/follow");
const User = require("../models/user");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user._id } })
            .select("name email profilePictureUrl");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleFollow = async (req, res) => {
    try {
        const followerId = req.user._id;
        const { followingId } = req.params;

        if (followerId.toString() === followingId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const existingFollow = await Follow.findOne({ followerId, followingId });

        if (existingFollow) {
            await Follow.findByIdAndDelete(existingFollow._id);
            return res.status(200).json({
                message: "Unfollowed successfully",
                isFollowing: false
            });
        }

        const newFollow = new Follow({
            followerId,
            followingId
        });

        await newFollow.save();
        res.status(201).json({
            message: "Followed successfully",
            isFollowing: true
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyFollowing = async (req, res) => {
    try {
        const following = await Follow.find({ followerId: req.user._id })
            .populate("followingId", "name profilePictureUrl");
        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyFollowers = async (req, res) => {
    try {
        const followers = await Follow.find({ followingId: req.user._id })
            .populate("followerId", "name profilePictureUrl");
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFollowStatus = async (req, res) => {
    try {
        const { followingId } = req.params;
        const followerId = req.user._id;

        const isFollowing = await Follow.exists({ followerId, followingId });
        const followerCount = await Follow.countDocuments({ followingId });
        const followingCount = await Follow.countDocuments({ followerId: followingId });

        res.status(200).json({
            isFollowing: !!isFollowing,
            followerCount,
            followingCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const followerCount = await Follow.countDocuments({ followingId: userId });
        const followingCount = await Follow.countDocuments({ followerId: userId });

        res.status(200).json({
            isFollowing: false,
            followerCount,
            followingCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    toggleFollow,
    getMyFollowing,
    getMyFollowers,
    getFollowStatus, // Added this back to the exports
    getMyStats
};