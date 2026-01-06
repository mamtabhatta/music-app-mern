const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { createPost, getPosts, deletePost } = require("../controllers/postController");

const router = express.Router();

router.post("/", protect, createPost);
router.get("/", protect, getPosts);
router.delete("/:postId", protect, deletePost);

module.exports = router;
