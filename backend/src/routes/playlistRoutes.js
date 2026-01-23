import express from "express";
import playlistController from "../controllers/playlistController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();


const {
    createPlaylist,
    getMyPlaylists,
    getPlaylistsByUserId,
    getPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    deletePlaylist
} = playlistController;

router.post("/", protect, createPlaylist);
router.get("/my", protect, getMyPlaylists);
router.get("/user/:userId", protect, getPlaylistsByUserId);
router.get("/:id", protect, getPlaylistById);
router.put("/:id/add", protect, addSongToPlaylist);
router.put("/:id/remove", protect, removeSongFromPlaylist);
router.delete("/:id", protect, deletePlaylist);

export default router;