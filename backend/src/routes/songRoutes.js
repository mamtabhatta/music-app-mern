const express = require("express");
const router = express.Router();
const {
    getAllSongs,
    getFeaturedSongs,
    getMadeForYouSongs,
    getTrendingSongs,
    getSongById,
    searchSongs
} = require("../controllers/songController");

router.get("/", getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);
router.get("/search", searchSongs);
router.get("/:id", getSongById);

module.exports = router;
