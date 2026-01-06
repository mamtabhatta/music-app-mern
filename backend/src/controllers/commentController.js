const Comment = require("../models/comment");
const Post = require("../models/post");

// Add comment to a post
const addComment = async (req, res) => {
    try {
        const { postId, text } = req.body;

        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ message: "Post not found" });

        const comment = await Comment.create({
            postId,
            userId: req.user._id,
            text,
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all comments for a post
const getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ postId })
            .populate("userId", "name profilePictureUrl")
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a comment (only by owner)
const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);
        if (!comment)
            return res.status(404).json({ message: "Comment not found" });

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not allowed to delete this comment" });
        }

        await comment.remove();
        res.json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addComment, getComments, deleteComment };
