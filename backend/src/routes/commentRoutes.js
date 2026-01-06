const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { addComment, getComments, deleteComment } = require("../controllers/commentController");

const router = express.Router();

router.post("/", protect, addComment);
router.get("/:postId", protect, getComments);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
