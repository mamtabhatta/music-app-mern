const Song = require("../models/song");
const supabase = require("../../config/supabase");

const getAllSongs = async (req, res) => {
    try {
        const songs = await Song.find({ approved: true })
            .sort({ createdAt: -1 })
            .populate("artistId", "name profilePictureUrl");
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFeaturedSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([
            { $match: { approved: true } },
            { $sample: { size: 6 } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artistId: 1,
                    coverImageUrl: 1,
                    songUrl: 1,
                },
            },
        ]);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMadeForYouSongs = async (req, res) => {
    try {
        const songs = await Song.aggregate([
            { $match: { approved: true } },
            { $sample: { size: 4 } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artistId: 1,
                    coverImageUrl: 1,
                    songUrl: 1,
                },
            },
        ]);
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTrendingSongs = async (req, res) => {
    try {
        const songs = await Song.find({ approved: true })
            .sort({ playCount: -1 })
            .limit(4)
            .select("_id title artistId coverImageUrl songUrl playCount");
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSongById = async (req, res) => {
    try {
        const song = await Song.findById(req.params.id).populate(
            "artistId",
            "name profilePictureUrl"
        );
        if (!song || !song.approved) {
            return res.status(404).json({ message: "Song not found" });
        }
        res.json(song);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchSongs = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const songs = await Song.find({
            approved: true,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { genre: { $regex: query, $options: "i" } },
            ],
        }).populate("artistId", "name profilePictureUrl");

        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSongs,
    getFeaturedSongs,
    getMadeForYouSongs,
    getTrendingSongs,
    getSongById,
    searchSongs,
};
