const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    getPendingSongs,
    approveSong,
    removeSong,
    removeUser,
    removePost,
    removeComment
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/roleMiddleware");

router.get("/users", protect, admin, getAllUsers);
router.get("/songs/pending", protect, admin, getPendingSongs);
router.patch("/song/approve/:songId", protect, admin, approveSong);
router.delete("/song/:songId", protect, admin, removeSong);
router.delete("/user/:userId", protect, admin, removeUser);
router.delete("/post/:postId", protect, admin, removePost);
router.delete("/comment/:commentId", protect, admin, removeComment);

module.exports = router;