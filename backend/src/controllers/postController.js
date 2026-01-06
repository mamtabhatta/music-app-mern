const Post = require("../models/post");

// Create a new post
const createPost = async (req, res) => {
    try {
        const { text, imageUrl } = req.body;

        const post = await Post.create({
            userId: req.user._id,
            text,
            imageUrl
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all posts
const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("userId", "name profilePictureUrl")
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a post (only by owner)
const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed to delete this post" });
        }

        await post.remove();
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPost, getPosts, deletePost };
