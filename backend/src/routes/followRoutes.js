const express = require("express");
const router = express.Router();
const {
    toggleFollow,
    getMyFollowing,
    getAllUsers,
    getFollowStatus,
    getMyStats
} = require("../controllers/followController");
const { protect } = require("../middlewares/authMiddleware");

router.get("/discover", protect, getAllUsers);
router.post("/toggle/:followingId", protect, toggleFollow);
router.get("/list", protect, getMyFollowing);
router.get("/status/:followingId", protect, getFollowStatus);
router.get("/my-stats", protect, getMyStats);

module.exports = router;