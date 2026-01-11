const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
    createPlaylist,
    getMyPlaylists,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist
} = require("../controllers/playlistController");

const router = express.Router();

router.post("/", protect, createPlaylist);
router.get("/my", protect, getMyPlaylists);
router.get("/:id", protect, getPlaylistById);
router.put("/:id/add", protect, addSongToPlaylist);
router.put("/:id/remove", protect, removeSongFromPlaylist);
router.delete("/:id", protect, deletePlaylist);

module.exports = router;