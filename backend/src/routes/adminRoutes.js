const express = require("express");
const router = express.Router();
const {
    
    getAllUsers,
    getPendingSongs,
    getAllSongs,
    approveSong,
    updateSong,
    removeSong,
    removeUser,
} = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/roleMiddleware");
router.get("/users", protect, admin, getAllUsers);
router.get("/songs/pending", protect, admin, getPendingSongs);
router.get("/songs/all", protect, admin, getAllSongs);
router.put("/song/approve/:songId", protect, admin, approveSong);
router.put("/song/:songId", protect, admin, updateSong);
router.delete("/song/:songId", protect, admin, removeSong);
router.delete("/user/:userId", protect, admin, removeUser);

module.exports = router;